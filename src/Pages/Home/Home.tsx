import React, { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { IConfig } from "../../interfaces";

const Home = () => {
  const [campany, setCampany] = useState<IConfig | null>(null);
  const getCompanyData = useCallback(async (id: string) => {
    const req = await axiosInstance
      .get(`companies/${id}`)
      .then((res) => res.data.company)
      .catch((err) => console.log(err));
    setCampany(req);
    return req;
  }, []);

  useEffect(() => {
    getCompanyData("67881c153d737752bbbcbe78");
  }, [getCompanyData]);

  return (
    <div>
      {campany?.companyName}
      <br />
      {campany?.address}
      <br />
      {campany?.phoneNumber}
      <br />
      <img
        src={`${process.env.REACT_APP_SERVER_URL}${campany?.image}`}
        width={300}
        height={300}
        alt=""
      />
    </div>
  );
};

export default Home;
