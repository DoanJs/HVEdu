import { useMemo, useState } from "react";
import { useFieldStore, useUserStore } from "../../zustand";
import AddFieldModal from "../modal/addField/AddFieldModal";
import BankCard from "./BankCard";
import "./BankPage.css";
import { fieldOrder } from "../../constants/info";

export default function BankPage() {
  const [keyword, setKeyword] = useState("");
  const { fields } = useFieldStore();
  const [showAddField, setShowAddField] = useState(false);
  const { user } = useUserStore();
  const isAdmin = user && user?.role === 'admin' 

  // const filteredFields = useMemo(() => {
  //   const text = keyword.trim().toLowerCase();
  //   if (!text) return fields;
  //   return fields.filter((item) => `${item.name}`.toLowerCase().includes(text));
  // }, [keyword, fields]);

  // fields
  //               .sort((a, b) => {
  //                 return fieldOrder.indexOf(a.id) - fieldOrder.indexOf(b.id);
  //               })

  const filteredFields = useMemo(() => {
    const text = keyword.trim().toLowerCase();

    return fields
      .filter((item) => {
        if (!text) return true;

        return `${item.name ?? ""}`.toLowerCase().includes(text);
      })
      .sort((a, b) => {
        const indexA = fieldOrder.indexOf(a.id);
        const indexB = fieldOrder.indexOf(b.id);

        const orderA = indexA === -1 ? Infinity : indexA;
        const orderB = indexB === -1 ? Infinity : indexB;

        return orderA - orderB;
      });
  }, [keyword, fields, fieldOrder]);

  return (
    <section className="bank-scroll-area">
      <div className="bank-toolbar">
        {isAdmin && (
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
