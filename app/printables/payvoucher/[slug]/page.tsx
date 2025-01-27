"use client"
import '../../../css/printables/PaymentVoucher.scss';
import { IPayVoucherInfo } from '../../../../schema/pvinfo';
import mongoose from 'mongoose';
import { SlugProps } from '@/interfaces';
import { useEffect, useState } from 'react';

// Mock data for demonstration
const pvInfo: IPayVoucherInfo = {
  _id: new mongoose.Types.ObjectId(),
  DocID: '12345',
  FillerUID: '12345',
  FilledByUID: '12345',
  SchoolName: 'ABC School',
  Amount: 500,
  Remarks: 'Tuition Fee',
  Posted: true,
  Type: 'Credit',
  DocName: "Fee Payment Voucher",
  Timestamp: new Date(),
};

const PaymentVoucher = ({params}: SlugProps) => {
  const [slug, setSlug] = useState("");

  useEffect(() => {
    const getSlug = async() => {
      const _slug = (await params).slug;
      setSlug(_slug);
    }
    getSlug();
  }, [params])

  useEffect(() => {
    if (slug === "") return;

  }, [slug])

  return (
    <div className="voucher">
      {/* Organization Copy */}
      <div className="copy">
        <div className="header">
          <h1>{pvInfo.DocName}</h1>
          <h2>{pvInfo.SchoolName}</h2>
        </div>
        <div className="details">
          <div>
            <span className="label">Date:</span>
            <span className="content">{pvInfo.Timestamp.toDateString()}</span>
          </div>
          <div>
            <span className="label">Voucher No:</span>
            <span className="content">{pvInfo.DocID}</span>
          </div>
        </div>
        <div className="details">
          <div>
            <span className="label">Guardian's Name:</span>
            <span className="content">[Guardian's Name]</span>
          </div>
          <div>
            <span className="label">Amount:</span>
            <span className="content">{pvInfo.Amount}</span>
          </div>
        </div>
        <div className="student-details">
          <div>
            <span className="label">Student's Name:</span>
            <span className="content">[Student's Name]</span>
          </div>
          <div>
            <span className="label">Class:</span>
            <span className="content">[Class]</span>
          </div>
        </div>
        <div className="remarks">
          <div>
            <span className="label">Remarks:</span>
            <span className="content">{pvInfo.Remarks}</span>
          </div>
        </div>
        <div className="footer">
          <div>
            <span className="label">Authorized By:</span>
            <span className="content">[Signature]</span>
          </div>
          <div>
            <span className="label">Received By:</span>
            <span className="content">[Signature]</span>
          </div>
        </div>
      </div>

      {/* Client Copy */}
      <div className="copy">
        <div className="header">
          <h1>Fee Payment Voucher</h1>
          <h2>{pvInfo.SchoolName}</h2>
        </div>
        <div className="details">
          <div>
            <span className="label">Date:</span>
            <span className="content">{pvInfo.Timestamp.toDateString()}</span>
          </div>
          <div>
            <span className="label">Voucher No:</span>
            <span className="content">{pvInfo.DocID}</span>
          </div>
        </div>
        <div className="details">
          <div>
            <span className="label">Guardian's Name:</span>
            <span className="content">[Guardian's Name]</span>
          </div>
          <div>
            <span className="label">Amount:</span>
            <span className="content">{pvInfo.Amount}</span>
          </div>
        </div>
        <div className="student-details">
          <div>
            <span className="label">Student's Name:</span>
            <span className="content">[Student's Name]</span>
          </div>
          <div>
            <span className="label">Class:</span>
            <span className="content">[Class]</span>
          </div>
        </div>
        <div className="remarks">
          <div>
            <span className="label">Remarks:</span>
            <span className="content">{pvInfo.Remarks}</span>
          </div>
        </div>
        <div className="footer">
          <div>
            <span className="label">Authorized By:</span>
            <span className="content">[Signature]</span>
          </div>
          <div>
            <span className="label">Received By:</span>
            <span className="content">[Signature]</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentVoucher;
