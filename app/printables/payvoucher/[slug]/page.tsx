"use client"
import '../../../css/printables/PaymentVoucher.scss';
import mongoose from 'mongoose';
import { SlugProps } from '@/interfaces';
import { useEffect, useState } from 'react';
import { sendRequest } from '@/utils';
import { ShowToast } from '@/app/utilsjsx';
import { Bounce, ToastContainer } from 'react-toastify';
import { IPayVoucherInfo } from '@/schema/pvinfo';
import { IUserInfo } from '@/schema/userinfo';

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

interface vDetails {
  user: IUserInfo,
  guardian: IUserInfo,
  voucher: IPayVoucherInfo
}

const PaymentVoucher = ({ params }: SlugProps) => {
  const [slug, setSlug] = useState("");
  const [voucher, setVoucher] = useState<vDetails>();

  useEffect(() => {
    const getSlug = async () => {
      const _slug = (await params).slug;
      setSlug(_slug);
    }
    getSlug();
  }, [params])

  useEffect(() => {
    if (slug === "") return;
    getVoucher(slug);
  }, [slug])

  const getVoucher = async (voucherID: string) => {
    const response = await sendRequest('/api/posts', {
      Request: 'voucherbyid',
      DocID: voucherID
    });
    if (response.message === "OK")
      setVoucher(response.results.doc);
    else
      ShowToast("Error", response.error, null);
  }

  return (
    <div className="voucher">
      <ToastContainer
        position="bottom-right"
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      {/* Organization Copy */}
      <div className="copy">
        <div className="header">
          <h1>{voucher?.voucher?.DocName}</h1>
          <h2>{voucher?.voucher?.SchoolName}</h2>
        </div>
        <div className="details">
          <div>
            <span className="label">Date:</span>
            <span className="content">{voucher?.voucher?.Timestamp.toDateString()}</span>
          </div>
          <div>
            <span className="label">Voucher No:</span>
            <span className="content">{voucher?.voucher?.DocID}</span>
          </div>
        </div>
        <div className="details">
          <div>
            <span className="label">Guardian's Name:</span>
            <span className="content">{voucher?.guardian.Name}</span>
          </div>
          <div>
            <span className="label">Amount:</span>
            <span className="content">{voucher?.voucher?.Amount}</span>
          </div>
        </div>
        <div className="student-details">
          <div>
            <span className="label">Student's Name:</span>
            <span className="content">{voucher?.user.Name}</span>
          </div>
        </div>
        <div className="remarks">
          <div>
            <span className="label">Remarks:</span>
            <span className="content">{voucher?.voucher?.Remarks}</span>
          </div>
        </div>
        <div className="footer">
          <div>
            <span className="label">Authorized By:</span>
            <span className="content"></span>
          </div>
          <div>
            <span className="label">Received By:</span>
            <span className="content">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </div>
        </div>
      </div>

      {/* Client Copy */}
      <div className="copy">
        <div className="header">
          <h1>Fee Payment Voucher</h1>
          <h2>{voucher?.voucher?.SchoolName}</h2>
        </div>
        <div className="details">
          <div>
            <span className="label">Date:</span>
            <span className="content">{voucher?.voucher?.Timestamp.toDateString()}</span>
          </div>
          <div>
            <span className="label">Voucher No:</span>
            <span className="content">{voucher?.voucher?.DocID}</span>
          </div>
        </div>
        <div className="details">
          <div>
            <span className="label">Guardian's Name:</span>
            <span className="content">{voucher?.guardian.Name}</span>
          </div>
          <div>
            <span className="label">Amount:</span>
            <span className="content">{voucher?.voucher?.Amount}</span>
          </div>
        </div>
        <div className="student-details">
          <div>
            <span className="label">Student's Name:</span>
            <span className="content">{voucher?.user.Name}</span>
          </div>
        </div>
        <div className="remarks">
          <div>
            <span className="label">Remarks:</span>
            <span className="content">{voucher?.voucher?.Remarks}</span>
          </div>
        </div>
        <div className="footer">
          <div>
            <span className="label">Authorized By:</span>
            <span className="content">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </div>
          <div>
            <span className="label">Received By:</span>
            <span className="content">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentVoucher;
