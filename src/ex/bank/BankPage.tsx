import { useMemo, useState } from 'react';
import BankCard from './BankCard';
import { fields } from './bankData';
import './BankPage.css';

export default function BankPage() {
  const [keyword, setKeyword] = useState('');

  const filteredFields = useMemo(() => {
    const text = keyword.trim().toLowerCase();
    if (!text) return fields;
    return fields.filter((item) => `${item.name} ${item.desc}`.toLowerCase().includes(text));
  }, [keyword]);

  return (
    <section className="bank-scroll-area">
      <div className="bank-toolbar">
        <div className="search-box">
          <i className="bi bi-search" />
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Tìm kiếm lĩnh vực..." />
        </div>
      </div>

      <section className="bank-grid">
        {filteredFields.map((item) => <BankCard key={item.id} item={item} />)}
      </section>
    </section>
  );
}
