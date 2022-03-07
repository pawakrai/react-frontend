import { css } from "@emotion/css";
import { DatePicker, Input, Modal, Select } from "antd";
import { useEffect, useState } from "react";

export const CreateModal = (props) => {
  const { visible, onCreate, onClose } = props;
  const [catagory, setCatagory] = useState("Shopping");
  const [date, setDate] = useState();
  const [amount, setAmount] = useState();

  useEffect(() => {
    setCatagory("Shopping");
    setDate();
    setAmount();
  }, []);

  return (
    <Modal
      title="Create Transaction"
      visible={visible}
      onOk={() => {
        const incomeCatagory = ["Salary"];
        const type = incomeCatagory.includes(catagory) ? "income" : "expense";
        const newTx = {
          type,
          catagory,
          date,
          amount: type === "expense" ? amount * -1 : amount,
        };
        onCreate(newTx);
      }}
      onCancel={() => {
        onClose();
      }}
    >
      <div
        className={css`
          display: flex;
          flex-direction: column;
          height: 150px;
          justify-content: space-between;
        `}
      >
        <Select
          placeholder="Select your category"
          value={catagory}
          onChange={(e) => {
            setCatagory(e);
          }}
        >
          <Select.Option value="Shopping">Shopping</Select.Option>
          <Select.Option value="Salary">Salary</Select.Option>
        </Select>
        <DatePicker
          onChange={(e) => {
            setDate(e.format("DD MMM YYYY"));
          }}
        />
        <Input
          value={amount}
          placeholder="Input Amount"
          type="number"
          onChange={(e) => {
            setAmount(e.target.value);
          }}
        />
      </div>
    </Modal>
  );
};
