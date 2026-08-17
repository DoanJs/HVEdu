import { httpsCallable } from "firebase/functions";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteDocData } from "../../constants/firebase/deleteDocData";
import { getDocData } from "../../constants/firebase/getDocData";
import { updateDocData } from "../../constants/firebase/updateDocData";
import { groupArrayWithField } from "../../constants/groupArrayWithField";
import {
  handleToastError,
  handleToastSuccess,
} from "../../constants/handleToast";
import {
  getCurrentMonth,
  getNextMonth,
  getPreviousMonth,
} from "../../constants/info";
import { functions } from "../../firebase.config";
import { PlanModel } from "../../models";
import {
  useCartEditStore,
  useCartStore,
  useChildStore,
  useFieldStore,
  useLoadingOverLayStore,
  usePlanStore,
  useSelectNavbarStore,
  useTitleNavbarStore,
  useUserStore,
} from "../../zustand";
import CartDemoCard from "./CartDemoCard";
import "./CartDemoPage.css";

export default function CartDemoPage() {
  const [keyword, setKeyword] = useState("");
  const { setTitleNavbar } = useTitleNavbarStore();
  const { setSelectNavbar } = useSelectNavbarStore();

  const navigate = useNavigate();
  const { carts, setCarts, removeCart, editCart } = useCartStore();
  const { addPlan, editPlan, plans } = usePlanStore();
  const { child } = useChildStore();
  const { user } = useUserStore();
  const { cartEdit, setCartEdit } = useCartEditStore(); // thực tế nó chỉ là planId thôi
  const [title, setTitle] = useState(getCurrentMonth());
  const { setLoadingOverLay } = useLoadingOverLayStore();
  const [disable, setDisable] = useState(false);
  const [plan, setPlan] = useState<PlanModel>();
  const { fields } = useFieldStore();

  const fieldMap = useMemo(() => {
    const map: any = {};
    fields.forEach((t) => {
      map[t.id] = t;
    });
    return map;
  }, [fields]);

  const filteredItems = useMemo(() => {
    const key = keyword.trim().toLowerCase();
    if (!key) return carts;
    return carts.filter(
      (item) =>
        item.field.toLowerCase().includes(key) ||
        item.target.toLowerCase().includes(key) ||
        item.strategy.toLowerCase().includes(key),
    );
  }, [keyword, carts]);

  useEffect(() => {
    if (carts.length > 0) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [carts]);

  useEffect(() => {
    if (cartEdit) {
      getDocData({ id: cartEdit, nameCollect: "plans", setData: setPlan });
    }
  }, [cartEdit]);

  useEffect(() => {
    if (plan) {
      setTitle(plan.title);
    }
  }, [plan]);

  const groupedCarts = useMemo(() => {
    return groupArrayWithField(carts, "fieldId");
  }, [carts]);

  // ---------------------

  const handleAddEditPlan = async () => {
    if (!user || !child) return;

    setLoadingOverLay(true);

    try {
      if (!cartEdit) {
        const res: any = await httpsCallable(
          functions,
          "createPlanFromCarts",
        )({
          title,
          childId: child.id,
          carts,
        });

        addPlan({
          id: res.data.planId,
          type: "KH",
          title,
          childId: child.id,
          teacherIds: child.teacherIds,
          authorId: user.id,
          status: "pending",
          comment: "",
          updateById: user.id,
          createAt: Date.now(),
          updateAt: Date.now(),
        });

        handleToastSuccess("Thêm mới kế hoạch thành công !");
      } else {
        await httpsCallable(
          functions,
          "updatePlanFromCarts",
        )({
          planId: cartEdit,
          childId: child.id,
          carts,
          title,
        });

        const index = plans.findIndex((item) => item.id === cartEdit);

        if (index !== -1) {
          editPlan(cartEdit, {
            ...plans[index],
            title,
            updateById: user.id,
            updateAt: Date.now(),
          });
        }

        handleToastSuccess("Chỉnh sửa kế hoạch thành công !");
      }

      setCarts([]);
      setTitle("");
      setCartEdit(null);

      navigate("../pending");
      setSelectNavbar("pending");
    } catch (error) {
      console.log(error);
      handleToastError(
        cartEdit
          ? "Chỉnh sửa kế hoạch thất bại !"
          : "Thêm mới kế hoạch thất bại !",
      );
    } finally {
      setLoadingOverLay(false);
    }
  };
  const handleSaveCart = () => {
    setLoadingOverLay(true);
    const promiseItems = carts.map((cart) =>
      updateDocData({
        nameCollect: "carts",
        id: cart.id,
        valueUpdate: cart,
        metaDoc: "carts",
      }),
    );

    Promise.all(promiseItems)
      .then(() => {
        handleToastSuccess("Lưu nháp giỏ hàng thành công !");
      })
      .catch((error) => {
        handleToastError("Lưu nháp giỏ hàng thất bại !");
        console.log(error);
      })
      .finally(() => {
        setLoadingOverLay(false);
      });
  };
  const handleDeleteCart = (id: string) => {
    removeCart(id);
    deleteDocData({
      nameCollect: "carts",
      id,
      metaDoc: "carts",
    });
  };
  const handleSelectIntervention = (id: string, val: string) => {
    editCart(id, val);
  };
  // console.log(carts);

  return (
    <>
      {carts.length > 0 && (
        <section className="cart-demo-actions">
          <div className="cart-demo-search">
            <i className="bi bi-search"></i>
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm kiếm mục tiêu trong giỏ..."
            />
          </div>

          <div className="cart-demo-action-buttons">
            <button className="btn-outline-danger-soft">
              <i className="bi bi-trash3"></i>
              Xóa tất cả
            </button>
            <button className="btn-primary-blue">
              <i className="bi bi-send-check"></i>
              Gửi chờ duyệt
            </button>
          </div>
        </section>
      )}

      <section className="cart-demo-grid">
        {filteredItems.map((item) => (
          <CartDemoCard
            key={item.id}
            item={item}
            fieldMap={fieldMap}
            handleDeleteCart={handleDeleteCart}
            handleSelectIntervention={handleSelectIntervention}
          />
        ))}
      </section>

      <footer className="cart-demo-footerbar">
        <div className="cart-demo-total">
          <i className="bi bi-bullseye"></i>
          <div>
            <span>Tổng số mục tiêu</span>
            <strong>{String(filteredItems.length).padStart(2, "0")}</strong>
          </div>
        </div>

        <div className="cart-demo-note">
          <i className="bi bi-info-circle"></i>
          <span>
            Bạn có thể tạo kế hoạch can thiệp hoặc báo cáo can thiệp từ các mục
            tiêu trong giỏ.
          </span>
        </div>

        <Link
          to="../bank"
          onClick={() => {
            setTitleNavbar({
              title: "Ngân hàng mục tiêu",
              subTitle: "Chọn lĩnh vực để xem và chọn mục tiêu",
            });
            setSelectNavbar("bank");
          }}
          className="cart-demo-continue"
        >
          <i className="bi bi-cart3"></i>
          Tiếp tục chọn mục tiêu
        </Link>

        {carts.length > 0 && (
          <>
            <div className="cart-demo-month">
              <i className="bi bi-calendar3"></i>

              <select value={title} onChange={(e) => setTitle(e.target.value)}>
                <option value={getPreviousMonth()}>{getPreviousMonth()}</option>
                <option value={getCurrentMonth()}>{getCurrentMonth()}</option>
                <option value={getNextMonth()}>{getNextMonth()}</option>
              </select>
            </div>

            {!cartEdit && (
              <button
                className="btn-primary-blue footer-create"
                style={{ background: "#2d9c4b" }}
                onClick={handleSaveCart}
              >
                <i className="bi bi-floppy"></i>
                Lưu nháp
              </button>
            )}
            <button
              className="btn-primary-blue footer-create"
              onClick={disable ? undefined : handleAddEditPlan}
            >
              {cartEdit ? (
                <>
                  <i className="bi bi-floppy-fill" />
                  Lưu kế hoạch
                </>
              ) : (
                <>
                  <i className="bi bi-send-check-fill" />
                  Gửi chờ duyệt
                </>
              )}
            </button>
          </>
        )}
      </footer>
    </>
  );
}
