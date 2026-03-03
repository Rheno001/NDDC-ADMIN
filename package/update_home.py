import re
import sys

file_path = '/Users/reno/Desktop/nddc-react-template/package/src/jsx/components/Dashboard/Home.tsx'

with open(file_path, 'r') as f:
    content = f.read()

# 1. Add new imports
new_imports = """import { UnpaidVendorTable } from "./Elements/UnpaidVendorTable";
import TotalStudent from "../pages/WidgetBasic/TotalStudent";
import ActiveUser from "../pages/WidgetBasic/ActiveUser";
import BloodPressure from "../pages/WidgetBasic/BloodPressure";
import TotalCourse from "../pages/WidgetBasic/TotalCourse";"""

content = content.replace('import { UnpaidVendorTable } from "./Elements/UnpaidVendorTable";', new_imports)

# 2. Replace the old cardBlog mapped loop with 4 separate columns manually defining the widgets
old_cards_block = r"""              <div className="row">
                \{cardBlog\.map\(\(item: cardBlogType, ind: number\) => \(
                  <div className="col-xl-3 col-6" key=\{ind\}>
                    <div className="content-box">
                      <div className=\{`icon-box icon-box-xl \$\{item\.change\} `\}>
                        \{item\.svg\}
                      </div>
                      <div className="chart-num">
                        <p>\{item\.title\}</p>
                        <h2 className="font-w700 mb-0">\{item\.number\}</h2>
                      </div>
                    </div>
                  </div>
                \)\)\}
              </div>"""

new_cards_block = """              <div className="row">
                <div className="col-xl-3 col-6">
                  <div className="card">
                    <div className="card-header border-0 pb-0">
                      <h4 className="card-title">Total Vendors</h4>
                    </div>
                    <div className="card-body">
                      <TotalStudent />
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-6">
                  <div className="card">
                    <div className="card-header border-0 pb-0">
                      <h4 className="card-title">Pending Vendors</h4>
                    </div>
                    <div className="card-body">
                      <ActiveUser />
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-6">
                  <div className="card">
                    <div className="card-header border-0 pb-0">
                      <h4 className="card-title">Approved Vendors</h4>
                    </div>
                    <div className="card-body">
                      <BloodPressure />
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-6">
                  <div className="card">
                    <div className="card-header border-0 pb-0">
                      <h4 className="card-title">Rejected Vendors</h4>
                    </div>
                    <div className="card-body">
                      <TotalCourse />
                    </div>
                  </div>
                </div>
              </div>"""

# Remove old mapping loop using regex
content = re.sub(
    r'<div className="row">\s*\{cardBlog\.map.*?</div>\s*</div>\s*\)\)\}\s*</div>', 
    new_cards_block, 
    content, 
    flags=re.DOTALL
)

with open(file_path, 'w') as f:
    f.write(content)

print("Widgets updated in Home.tsx")
