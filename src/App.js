import "./App.css";
import AddCustomerModal from "./components/models/add-customer";
import AddTransactionModal from "./components/models/add-transaction";
import BatchAddTransactionModal from "./components/models/batch-add-transaction";
import Table from "./components/table/table";

function App() {
  return (
    <div>
      <div style={{ padding: 16, display: "flex", gap: 12 }}>
        <AddCustomerModal />
        <AddTransactionModal />
        <BatchAddTransactionModal />
      </div>
      <div style={{padding: 16, paddingTop: 0}}>
        <Table />
      </div>
    </div>
  );
}

export default App;
