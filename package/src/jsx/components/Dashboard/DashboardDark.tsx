import { ReactNode, useEffect } from "react";

//Import Components
import { SVGICON } from "./Content";
import { UnpaidVendorTable } from "./Elements/UnpaidVendorTable";

interface cardBlogType {
  title: string;
  svg: ReactNode;
  number: string;
  change: string;
}

const cardBlog: cardBlogType[] = [
  { title: "Vendors", svg: SVGICON.user, number: "93K", change: "std-data" },
  {
    title: "Teachers",
    svg: SVGICON.user2,
    number: "74K",
    change: "teach-data",
  },
  { title: "Events", svg: SVGICON.event, number: "40K", change: "event-data" },
  {
    title: "Foods",
    svg: SVGICON.food,
    number: "32K",
    change: "food-data bg-dark",
  },
];

const DashboardDark = () => {
  useEffect(() => {
    document.body.setAttribute("data-theme-version", "dark");
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-body pb-xl-4 pb-sm-3 pb-0">
              <div className="row">
                {cardBlog.map((item, ind) => (
                  <div className="col-xl-3 col-6" key={ind}>
                    <div className="content-box">
                      <div className={`icon-box icon-box-xl ${item.change}`}>
                        {item.svg}
                      </div>
                      <div className="chart-num">
                        <p>{item.title}</p>
                        <h2 className="font-w700 mb-0">{item.number}</h2>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-xl-12">
        <div className="card">
          <div className="card-header border-0 p-3">
            <h4 className="heading mb-0">Total Approved Vendors</h4>
          </div>
          <div className="card-body p-0">
            <UnpaidVendorTable />
          </div>
        </div>
      </div>
    </>
  );
};
export default DashboardDark;
