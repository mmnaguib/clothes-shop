import React, { useState } from "react";
import Heading from "../../Components/Heading";
import InputField from "../../Components/InputField";
import Button from "../../Components/Button";

const Config = () => {
  const [companyName, setCompanyName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("01");
  const [image, setImage] = useState<File | null>(null);
  const [address, setAddress] = useState<string>("");
  const [showImage, setShowImage] = useState<string | null>(null);

  // حالات الخطأ لكل حقل
  const [errors, setErrors] = useState({
    companyName: "",
    phoneNumber: "",
    address: "",
    image: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const imgUrl = URL.createObjectURL(files[0]);
      setShowImage(imgUrl);
      setImage(files[0]);
      setErrors((prev) => ({ ...prev, image: "" })); // إزالة الخطأ
    } else {
      setErrors((prev) => ({ ...prev, image: "يرجى اختيار صورة للشركة." }));
    }
  };

  const validateInputs = () => {
    const newErrors = {
      companyName: "",
      phoneNumber: "",
      address: "",
      image: "",
    };
    let isValid = true;

    if (!companyName.trim()) {
      newErrors.companyName = "اسم الشركة مطلوب.";
      isValid = false;
    }

    if (!/^01[0-9]{9}$/.test(phoneNumber)) {
      newErrors.phoneNumber =
        "يجب أن يبدأ رقم الهاتف بـ 01 وأن يكون مكونًا من 11 رقمًا.";
      isValid = false;
    }

    if (!address.trim()) {
      newErrors.address = "عنوان الشركة مطلوب.";
      isValid = false;
    }

    if (!image) {
      newErrors.image = "يرجى اختيار صورة للشركة.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const companyConfig = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (validateInputs()) {
      console.log(companyName, phoneNumber, address, image);
    }
  };

  return (
    <>
      <div
        className="formWrapper"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
        }}
      >
        <Heading title="إعدادات الشركة." />
        <form onSubmit={companyConfig}>
          <div style={{ marginBottom: "16px" }}>
            <InputField
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              label="اسم الشركة"
              required
            />
            {errors.companyName && (
              <span style={{ color: "red", fontSize: "14px" }}>
                {errors.companyName}
              </span>
            )}
          </div>
          <div style={{ marginBottom: "16px" }}>
            <InputField
              type="text"
              value={phoneNumber}
              onChange={(e) => {
                const input = e.target.value;
                if (input === "" || /^[0-9]*$/.test(input)) {
                  setPhoneNumber(input);
                  setErrors((prev) => ({ ...prev, phoneNumber: "" }));
                }
              }}
              onBlur={() => {
                if (!/^01[0-9]{9}$/.test(phoneNumber)) {
                  setErrors((prev) => ({
                    ...prev,
                    phoneNumber:
                      "يجب أن يبدأ رقم الهاتف بـ 01 وأن يكون مكونًا من 11 رقمًا.",
                  }));
                }
              }}
              label="رقم الهاتف للشركة"
              required
              maxLength="11"
            />
            {errors.phoneNumber && (
              <span style={{ color: "red", fontSize: "14px" }}>
                {errors.phoneNumber}
              </span>
            )}
          </div>
          <div style={{ marginBottom: "16px" }}>
            <InputField
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              label="عنوان الشركة"
              required
              maxLength="40"
            />
            {errors.address && (
              <span style={{ color: "red", fontSize: "14px" }}>
                {errors.address}
              </span>
            )}
          </div>
          <div style={{ position: "relative", marginBottom: "16px" }}>
            <InputField
              type="file"
              onChange={handleFileChange}
              label="صورة الشركة"
              required
            />
            {showImage && (
              <img
                src={showImage}
                width={45}
                height={45}
                style={{ position: "absolute", top: "28px", left: 0 }}
                onClick={() => setShowImage(null)}
              />
            )}
            {errors.image && (
              <span style={{ color: "red", fontSize: "14px" }}>
                {errors.image}
              </span>
            )}
          </div>
          <div style={{ textAlign: "center" }}>
            <Button label="إضافة" />
          </div>
        </form>
      </div>
    </>
  );
};

export default Config;
