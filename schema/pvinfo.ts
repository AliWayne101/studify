import mongoose, { Model, Schema } from "mongoose";

export interface IPayVoucherInfo {
    _id: mongoose.Types.ObjectId;
    DocID: string;
    FillerUID: string;
    SchoolName: string;
    Amount: number;
    Remarks: string;
    Posted: boolean;
    Type: string; //Credit - Fee
    DocName: string;
    Timestamp: Date;
    FilledByUID: string;
}

const Voucher = new Schema<IPayVoucherInfo>({
    _id: mongoose.Schema.Types.ObjectId,
    DocID: String,
    FillerUID: String,
    FilledByUID: String,
    SchoolName: String,
    Amount: Number,
    Remarks: {
        type: String,
        default: 'School Fee'
    },
    Posted: {
        type: Boolean,
        default: false
    },
    Type: {
        type: String,
        default: 'credit'
    },
    DocName: String,
    Timestamp: {
        type: Date,
        default: Date.now()
    }
});

let VoucherModel: Model<IPayVoucherInfo>;
try {
    VoucherModel = mongoose.model<IPayVoucherInfo>("voucherinfo");
} catch {
    VoucherModel = mongoose.model<IPayVoucherInfo>("voucherinfo", Voucher, "Vouchers");
}

export default VoucherModel