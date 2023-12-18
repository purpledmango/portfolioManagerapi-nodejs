import { Schema, model } from "mongoose";

const projectScheama = Schema({
    name: { type: String, required: true },
    contactNo: { type: String, required: true },
    description: { type: String, required: true },

})

const ProjectModel = model("project", projectScheama)

export default ProjectModel;