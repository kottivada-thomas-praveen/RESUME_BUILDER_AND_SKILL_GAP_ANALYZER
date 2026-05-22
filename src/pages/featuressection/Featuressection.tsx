import "./Featuressection.css"
import {
  FileText,
  LayoutGrid,
  BadgeCheck,
  BrainCircuit,
  Eye,
  FileDown,
} from "lucide-react";
function Featuressection(){
    return(
        <>
            <section className="Features-section bg-blue-800">
      <h1>Everything You Need to Get Hired</h1>

      <div className="boxes ">
        {/* box-1 */}
        <div className="box-1 bg-blue-500">
          <div className="logo">
            <FileText className="bg-blue-500 px-10" size={40} />
          </div>
          <h6 className="box1-text">
            {" "}
            <strong>AI Resume Builder</strong>{" "}
            <span className="fea-desc">
              Create professional, ATS-optimised resume with modern templates
            </span>
          </h6>
        </div>

        {/* Box-2 */}

        <div className="box-2 bg-blue-500">
          <div className="icon-cont">
            <LayoutGrid className="bg-blue-500 px-10" size={40}/>
          </div>
          <strong>Skill Gap Analysis</strong>
          <br />
          <i>
            Compare your skills with industry requirements and identify missing
            technologies.
          </i>
        </div>

        {/* Box-3 */}
        <div className="box-3 bg-blue-500">
          <div className="icon-cont">
            <BadgeCheck className="bg-blue-500 px-10" size={40}/>
          </div>
          <strong>ATS Score Checker</strong> <br />
          <i>Improve your resume score and increase interview chances.</i>
        </div>

        {/* box-4 */}
        <div className="box-4 bg-blue-500">
          <div className="icon-cont">
            <BrainCircuit className="bg-blue-500 px-10" size={40}/>
          </div>
          <strong>Smart Recommendations</strong>
          <br />
          <i>
            Get personalized suggestions for courses, certifications, and
            projects.
          </i>
        </div>

        {/* box-5 */}
        <div className="box-5 bg-blue-500">
          <div className="icon-cont">
            <Eye className="bg-blue-500 px-10" size={40}/>
          </div>
          <strong>Real-time Preview</strong>
          <br />
          <i>Edit and preview your resume instantly with live updates.</i>
        </div>

        {/* Box-6 */}
        <div className="box-6 bg-blue-500">
          <div className="icon-cont">
            <FileDown className="bg-blue-500 px-10" size={40}/>
          </div>
          <strong>Multi-template Export</strong> <br />
          <i>Export your resume in PDF with elegant professional designs.</i>
        </div>
      </div>
    </section>
        </>
    )
}

export default Featuressection;