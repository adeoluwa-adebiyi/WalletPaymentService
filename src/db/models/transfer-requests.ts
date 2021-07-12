import { model } from "mongoose";
import transferRequestSchema from "../schemas/transfer-requests";

export default model("transferRequest", transferRequestSchema);