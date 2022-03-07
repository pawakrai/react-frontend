import logo from "./logo.svg";
import "./App.css";
import "antd/dist/antd.css";
import { css } from "@emotion/css";
import { Modal, Button, Input, Select, DatePicker, message } from "antd";
import { TransactionRow } from "./Components/TransactionRow";
import { useEffect, useState } from "react";
import { CreateModal } from "./Components/CreateModal";
import styled from "@emotion/styled";
import axios from "axios";

axios.defaults.baseURL = "https://backend-expressjs.herokuapp.com/";

const PageContainer = styled.div`
  background-color: aliceblue;
  height: 100vh;
  width: 100vw;
  padding-top: 100px;
`;

const PageContent = styled.div`
  width: 80%;
  margin: auto;
  max-width: 500px;
`;

const FlexBox = styled.div`
  display: flex;
`;

const getTokenHeader = (token) => {
  return {
    headers: {
      authorization: "Bearer " + token,
    },
  };
};

function App() {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [search, setSearch] = useState("");
  const [token, setToken] = useState();

  const fetchTransactions = async () => {
    const response = await axios.get(
      "/api/transactions",
      getTokenHeader(token)
    );
    console.log(response);
    console.log(response.data.transactions);
    console.log(response.data.transactions[0].catagory);
    setTransactions(response.data.transactions);
  };

  useEffect(() => {
    const oldToken = localStorage.getItem("token");
    if (oldToken) {
      setToken(oldToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchTransactions();
    }
  }, [token]);
  const onDeleteItem = async (_id) => {
    const deleted = await axios.delete(
      "/api/transaction/" + _id,
      getTokenHeader(token)
    );
    console.log(deleted);
    setTransactions(transactions.filter((tx) => tx._id !== _id));
  };

  const filteredTransaction = transactions.filter((tx) =>
    tx.catagory.includes(search)
  );

  return (
    <PageContainer>
      <div
        className={css`
          position: fixed;
          top: 0;
          display: flex;
          width: 100%;
          padding: 16px;
          background-color: white;
          z-index: 10;
        `}
      >
        {token ? (
          <div
            className={css`
              display: flex;
            `}
          >
            <Button
              onClick={() => {
                setToken();
                localStorage.removeItem("token");
                setTransactions([]);
              }}
            >
              Logout
            </Button>
            {token}
          </div>
        ) : (
          <div
            className={css`
              display: flex;
            `}
          >
            <Input
              placeholder="username"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <Input
              placeholder="password"
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <Button
              onClick={async () => {
                console.log(username, password);
                const login = await axios.post("/user/login", {
                  username,
                  password,
                });
                setToken(login.data.token);
                localStorage.setItem("token", login.data.token);
                //console.log(login);
              }}
            >
              Login
            </Button>
          </div>
        )}
      </div>
      <PageContent>
        <FlexBox>
          <Input
            placeholder="Search by text"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <Button onClick={() => setCreateModalVisible(true)}>Create</Button>
        </FlexBox>
        {transactions.length === 0 ? (
          <FlexBox
            className={css`
              padding-top: 3rem;
              justify-content: center;
            `}
          >
            <h1>No data</h1>
          </FlexBox>
        ) : (
          ""
        )}
        {filteredTransaction.map((tx) => (
          <TransactionRow tx={tx} onDeleteItem={onDeleteItem} />
        ))}
      </PageContent>
      <CreateModal
        visible={createModalVisible}
        onCreate={async (tx) => {
          const created = await axios.post(
            "/api/transaction",
            tx,
            getTokenHeader(token)
          );
          message.success("create Transaction sucess");
          setTransactions([...transactions, tx]);
          setCreateModalVisible(false);
        }}
        onClose={() => setCreateModalVisible(false)}
      />
    </PageContainer>
  );
}

export default App;
