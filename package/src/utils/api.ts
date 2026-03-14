interface FetchOptions extends RequestInit {
    headers?: Record<string, string>;
}

export const apiFetch = async (url: string, options: FetchOptions = {}) => {
    const apiKey = import.meta.env.VITE_API_KEY || "";
    const accessToken = sessionStorage.getItem("accessToken");

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        ...options.headers,
    };

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    try {
        let response = await fetch(url, { ...options, headers });

        // Handle 401 Unauthorized
        if (response.status === 401) {
            const refreshToken = sessionStorage.getItem("refreshToken");
            if (refreshToken) {
                // Attempt to refresh the token
                const refreshResponse = await fetch("/api/v1/auth/refresh", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": apiKey,
                    },
                    body: JSON.stringify({ refreshToken }),
                });

                if (refreshResponse.ok) {
                    const result = await refreshResponse.json();
                    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = result.data;

                    // Update storage
                    sessionStorage.setItem("accessToken", newAccessToken);
                    sessionStorage.setItem("refreshToken", newRefreshToken);

                    const username = sessionStorage.getItem("username");
                    if (username) {
                        sessionStorage.setItem("AUTH", JSON.stringify({ username, accessToken: newAccessToken }));
                    }

                    // Retry the original request with the new token
                    headers["Authorization"] = `Bearer ${newAccessToken}`;
                    response = await fetch(url, { ...options, headers });

                    // If it's still 401, then logout
                    if (response.status === 401) {
                        handleAutoLogout();
                    }
                } else {
                    handleAutoLogout();
                }
            } else {
                handleAutoLogout();
            }
        }

        return response;
    } catch (error) {
        console.error("API Fetch Error:", error);
        throw error;
    }
};

const handleAutoLogout = () => {
    sessionStorage.clear();
    // We use window.location.href to force a full reload and redirect to login
    // This ensures all state is cleared and the user is sent back.
    window.location.href = "/login";
};
