import { serverTimestamp } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { addDocData } from "../../constants/firebase/addDocData";
import { deleteDocData } from "../../constants/firebase/deleteDocData";
import { getDocData } from "../../constants/firebase/getDocData";
import { TargetModel } from "../../models";
import { CartModel } from "../../models/CartModel";
import {
  useCartStore,
  useChildStore,
  useLoadingOverLayStore,
  useTargetStore,
  useUserStore,
} from "../../zustand";
import "./TargetPage.css";
import AddTargetModal from "../modal/addTarget/AddTargetModal";

export default function TargetPage() {
  const [keyword, setKeyword] = useState("");
  const { bankId, childId } = useParams();
  const { targets } = useTargetStore();
  const { user } = useUserStore();
  const { carts, removeCart, addCart } = useCartStore();
  const { setChild, child } = useChildStore();
  const { setLoadingOverLay, loadingOverLay } = useLoadingOverLayStore();
  const [showAddTarget, setShowAddTarget] = useState(false);

  useEffect(() => {
    if (!childId) return;
    getDocData({ id: childId, nameCollect: "children", setData: setChild });
  }, [childId]);

  const targetsByField = useMemo(() => {
    return targets.filter((target) => target.fieldId === bankId);
  }, [targets, bankId]);
  const selectedIds = useMemo(() => {
    return new Set(carts.map((cart: CartModel) => cart.targetId));
  }, [carts]);

  // const filteredTargets = useMemo(() => {
  //   const text = keyword.trim().toLowerCase();
  //   if (!text) return targetsByField;
  //   return targetsByField.filter((item) =>
  //     `${item.name} ${item.content} level: ${item.level}`
  //       .toLowerCase()
  //       .includes(text),
  //   );
  // }, [keyword, targetsByField]);

  const filteredTargets = useMemo(() => {
    const text = keyword.trim().toLowerCase();

    const compareLevel = (
      levelA: string | number,
      levelB: string | number,
    ): number => {
      const a = String(levelA ?? "").trim();
      const b = String(levelB ?? "").trim();

      return a.localeCompare(b, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    };

    return [...targetsByField]
      .filter((item) => {
        if (!text) return true;

        const searchableText = `
        ${item.name ?? ""}
        ${item.content ?? ""}
        ${item.title ?? ""}
        level: ${item.level ?? ""}
      `.toLowerCase();

        return searchableText.includes(text);
      })
      .sort((a, b) => {
        const levelResult = compareLevel(a.level, b.level);

        if (levelResult !== 0) {
          return levelResult;
        }

        return (a.order ?? 0) - (b.order ?? 0);
      });
  }, [keyword, targetsByField]);

  const toggleGoal = async (target: TargetModel) => {
    if (!user || !child || loadingOverLay) return;
    const existingCart = carts.find(
      (cart: CartModel) => cart.targetId === target.id,
    );

    setLoadingOverLay(true);

    try {
      // ❌ ĐÃ TỒN TẠI → XÓA
      if (existingCart) {
        await deleteDocData({
          nameCollect: "carts",
          id: existingCart.id,
          metaDoc: "carts",
        });

        removeCart(existingCart.id);
        return;
      }

      // ✅ CHƯA CÓ → THÊM
      const cartValue = {
        targetId: target.id,
        level: target.level,
        name: target.name,
        fieldId: target.fieldId,

        content: target.content || "",
        intervention: "",
        childId: child.id,
        teacherIds: child.teacherIds,
        authorId: user.id,

        createAt: serverTimestamp(),
        updateAt: serverTimestamp(),
      };

      const result = await addDocData({
        nameCollect: "carts",
        value: cartValue,
        metaDoc: "carts",
      });

      addCart({
        ...cartValue,
        id: result.id,
      });
    } catch (err) {
      console.error("toggleGoal error:", err);
    } finally {
      setLoadingOverLay(false);
    }
  };

  return (
    <section className="target-content">
      <div className="target-bg-star one">★</div>
      <div className="target-bg-star two">★</div>
      <div className="target-bg-star three">★</div>

      <div className="target-toolbar">
        <div className="target-search">
          <i className="bi bi-search" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm kiếm mục tiêu...level: 2"
          />
        </div>

        <button className="target-filter">
          <i className="bi bi-funnel" />
          {filteredTargets.length}
        </button>
        {user && user.role === "admin" && (
          <button className="target-add" onClick={() => setShowAddTarget(true)}>
            <i className="bi bi-plus-lg" />
            Thêm mục tiêu
          </button>
        )}
      </div>

      <div className="target-table-card">
        <div className="target-table-scroll">
          <table className="target-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Mục tiêu</th>
                <th>Cấp độ</th>
                <th>Chiến lược</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {filteredTargets.length > 0 ? (
                filteredTargets.map((item, index) => {
                  const isSelected = selectedIds.has(item.id);

                  return (
                    <tr
                      key={item.id}
                      className={isSelected ? "target-row-selected" : ""}
                    >
                      <td className="target-stt">{index + 1}</td>

                      <td className="target-goal">
                        <strong>
                          {item.name}
                          {isSelected && (
                            <span className="target-selected-check">
                              <i className="bi bi-check-circle-fill" />
                            </span>
                          )}
                        </strong>
                        {/* <span>{item.example}</span> */}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <i style={{ color: "#0884e8" }}>{item.title}</i>
                        <span className={`target-badge ${`item.supportType`}`}>
                          Level: {item.level}
                        </span>
                      </td>

                      <td className="target-strategy">
                        {/* <i className={`bi ${item.icon}`} /> */}
                        <span style={{ whiteSpace: "pre-line" }}>
                          {item.content}
                        </span>
                      </td>

                      <td className="target-actions">
                        <button
                          type="button"
                          className={isSelected ? "selected" : ""}
                          onClick={() => toggleGoal(item)}
                        >
                          {isSelected ? (
                            <>
                              <i className="bi bi-check-lg" />
                              Đã chọn
                            </>
                          ) : (
                            "Chọn"
                          )}
                        </button>

                        <i className="bi bi-three-dots-vertical" />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    style={{ height: "200px" }}
                    className="target-stt"
                  >
                    Dữ liệu trống, quay lại tìm kiếm sau!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {bankId && (
        <AddTargetModal
          fieldId={bankId}
          show={showAddTarget}
          loading={false}
          onClose={() => setShowAddTarget(false)}
        />
      )}
    </section>
  );
}
