import { useMemo, useState } from "react";
import "./CartPage.css";
import CartRow from "./CartRow";
import { cartTargets } from "./cartData";

export default function CartPage() {
  const [keyword, setKeyword] = useState("");

  const filteredTargets = useMemo(() => {
    const text = keyword.trim().toLowerCase();
    if (!text) return cartTargets;
    return cartTargets.filter((item) =>
      `${item.field} ${item.target} ${item.strategy}`
        .toLowerCase()
        .includes(text),
    );
  }, [keyword]);

  return (
    <>
      <section className="cart-toolbar">
        <div className="search-box">
          <i className="bi bi-search" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm kiếm mục tiêu trong giỏ..."
          />
        </div>
        <div className="toolbar-actions">
          <button className="clear-btn">
            <i className="bi bi-trash3" /> Xóa tất cả
          </button>
          <button className="primary-btn">
            <i className="bi bi-file-earmark-plus" /> Tạo kế hoạch
          </button>
        </div>
      </section>

      <section className="cart-table-card">
        <div className="cart-head">
          <span>LĨNH VỰC</span>
          <span>MỤC TIÊU</span>
          <span>CHIẾN LƯỢC</span>
          <span>MỨC ĐỘ HỖ TRỢ</span>
          <span>THAO TÁC</span>
        </div>

        <div className="cart-list">
          {filteredTargets.map((item) => (
            <CartRow key={item.id} item={item} />
          ))}
        </div>
      </section>

      <footer className="cart-footer">
        <div className="total-card">
          <i className="bi bi-bullseye" />
          <div>
            <span>Tổng số mục tiêu</span>
            <strong>{String(filteredTargets.length).padStart(2, "0")}</strong>
          </div>
        </div>
        <div className="info-card">
          <i className="bi bi-info-circle" /> Bạn có thể tạo kế hoạch can thiệp
          hoặc báo cáo can thiệp từ các mục tiêu trong giỏ.
        </div>
        <button className="continue-btn">
          <i className="bi bi-cart-plus" /> Tiếp tục chọn mục tiêu
        </button>
        <button className="primary-btn bottom" style={{background: "#2d9c4b"}}>
          <i className="bi bi-floppy" /> Lưu nháp
        </button>
        <button className="primary-btn bottom">
          <i className="bi bi-file-earmark-plus" /> Gửi kế hoạch chờ duyệt
        </button>
      </footer>
    </>
  );
}
