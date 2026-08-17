import { useMemo, useState } from "react";
import { useFieldStore, useUserStore } from "../../zustand";
import AddFieldModal from "../modal/addField/AddFieldModal";
import BankCard from "./BankCard";
import "./BankPage.css";

export default function BankPage() {
  const [keyword, setKeyword] = useState("");
  const { fields } = useFieldStore();
  const [showAddField, setShowAddField] = useState(false);
  const { user } = useUserStore();

  const filteredFields = useMemo(() => {
    const text = keyword.trim().toLowerCase();
    if (!text) return fields;
    return fields.filter((item) => `${item.name}`.toLowerCase().includes(text));
  }, [keyword, fields]);

  return (
    <section className="bank-scroll-area">
      <div className="bank-toolbar">
        {user && user.role && (
          <button className="target-add" onClick={() => setShowAddField(true)}>
            <i className="bi bi-plus-lg" />
            Thêm lĩnh vực
          </button>
        )}
        <div className="search-box">
          <i className="bi bi-search" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm kiếm lĩnh vực..."
          />
        </div>
      </div>

      <section className="bank-grid">
        {filteredFields.map((item) => (
          <BankCard key={item.id} item={item} />
        ))}
      </section>

      <AddFieldModal
        show={showAddField}
        loading={false}
        onClose={() => setShowAddField(false)}
      />
    </section>
  );
}
