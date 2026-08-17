import { serverTimestamp } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { FormEvent, useEffect, useMemo, useState } from "react";
import Select, { MultiValue } from "react-select";
import { addDocData } from "../../../constants/firebase/addDocData";
import {
  handleToastError,
  handleToastSuccess,
} from "../../../constants/handleToast";
import {
  dateInputToString,
  icon512,
  stringToDateInput,
} from "../../../constants/info";
import { uploadChildAvatar } from "../../../constants/uploadAvatar";
import { functions } from "../../../firebase.config";
import { ChildrenModel, UserModel } from "../../../models";
import { useChildrenStore, useLoadingOverLayStore } from "../../../zustand";
import "./AddChildModal.css";

export type NewChildForm = {
  fullName: string;
  nickName: string;
  birthday: string;
  gender: string;
  //   parentName: string;
  //   parentPhone: string;
  //   address: string;
  //   startDate: string;
  //   note: string;
  avatarFile: File | null;
  status: string;
};
interface OptionType {
  id: string;
  fullName: string;
}
type AddChildModalProps = {
  teachers: UserModel[];
  show: boolean;
  onClose: () => void;
  loading?: boolean;
};

const initialForm: NewChildForm = {
  fullName: "",
  nickName: "",
  birthday: "",
  gender: "",
  //   parentName: "",
  //   parentPhone: "",
  //   address: "",
  //   startDate: "",
  //   note: "",
  avatarFile: null,
  status: "studying",
};

export default function AddChildModal({
  teachers,
  show,
  onClose,
  loading = false,
}: AddChildModalProps) {
  const [form, setForm] = useState<NewChildForm>(initialForm);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [selectTeachers, setSelectTeachers] = useState<OptionType[]>([]);
  const { setLoadingOverLay } = useLoadingOverLayStore();
  const [childEdit, setChildEdit] = useState<ChildrenModel>();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { addChild, editChild, children, removeChild } = useChildrenStore();
  const [isAddChild, setIsAddChild] = useState(true);

  const teacherMap = useMemo(() => {
    const map: any = {};
    teachers.forEach((t) => {
      map[t.id] = t;
    });
    return map;
  }, [teachers]);

  const errors = useMemo(() => {
    return {
      fullName:
        submitted && !form.fullName.trim()
          ? "Vui lòng nhập họ và tên trẻ."
          : "",
      birthday: submitted && !form.birthday ? "Vui lòng chọn ngày sinh." : "",
      gender: submitted && !form.gender ? "Vui lòng chọn giới tính." : "",
      status: submitted && !form.status ? "Vui lòng trạng thái trẻ." : "",
      teacherIds:
        submitted && selectTeachers.length === 0
          ? "Vui lòng chọn giáo viên phụ trách."
          : "",
      //   parentName:
      //     submitted && !form.parentName.trim()
      //       ? "Vui lòng nhập tên phụ huynh."
      //       : "",
      //   parentPhone:
      //     submitted && !form.parentPhone.trim()
      //       ? "Vui lòng nhập số điện thoại."
      //       : "",
    };
  }, [form, submitted, selectTeachers]);

  const isValid =
    form.fullName.trim() !== "" && form.birthday !== "" && form.gender !== "";

  useEffect(() => {
    if (!show) return;

    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [show, onClose, loading]);

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  useEffect(() => {
    if (childEdit) {
      setForm({
        fullName: childEdit.fullName,
        nickName: childEdit.shortName,
        gender: childEdit.gender,
        birthday: stringToDateInput(childEdit.birth),
        status: childEdit.status || "studying",
        avatarFile: null,
      });
      setAvatarPreview(childEdit.avatar);
      setSelectTeachers(childEdit.teacherIds.map((_) => teacherMap[_]));
    }
  }, [childEdit]);

  if (!show) return null;

  const updateField = <K extends keyof NewChildForm>(
    field: K,
    value: NewChildForm[K],
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const removeAvatar = () => {
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }

    setAvatarPreview("");
    updateField("avatarFile", null);
  };

  const resetAndClose = () => {
    if (loading) return;

    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }

    setForm(initialForm);
    setAvatarPreview("");
    setSubmitted(false);
    onClose();
  };

  //   --------------------
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };
  const resetData = () => {
    setForm(initialForm);
    setAvatarFile(null);
    setAvatarPreview("");
    setChildEdit(undefined);
  };
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);

    if (!isValid || loading) return;

    const data = {
      fullName: form.fullName,
      avatar: avatarPreview || icon512,

      status: form.status,
      shortName: form.nickName,
      birth: dateInputToString(form.birthday),
      gender: form.gender,
      teacherIds: (selectTeachers.map((_) => _.id) as string[]) || [],
      managerIds: [],
      parentIds: [],
      createAt: Date.now(),
      updateAt: Date.now(),
    };

    onClose();
    setLoadingOverLay(true);

    try {
      // ✅ CẬP NHẬT TRẺ: dùng Cloud Function
      if (childEdit) {
        let avatar = data.avatar;

        if (avatarFile) {
          const resultAvatar = await uploadChildAvatar(
            avatarFile,
            childEdit.id,
          );

          avatar = resultAvatar.avatar;
        }

        const res = await httpsCallable<
          {
            childId: string;
            fullName: string;
            avatar: string;
            status: string;
            shortName: string;
            birth: string;
            gender: string;
            teacherIds: string[];
          },
          {
            ok: boolean;
            childId: string;
            teacherChanged: boolean;
            updatedCount: number;
          }
        >(
          functions,
          "updateChild",
        )({
          childId: childEdit.id,
          ...data,
          avatar,
        });
        editChild(childEdit.id, { ...data, avatar });

        handleToastSuccess(
          res.data.teacherChanged
            ? `Cập nhật trẻ thành công! Đã đồng bộ ${res.data.updatedCount} mục liên quan.`
            : `Cập nhật trẻ thành công!`,
        );
      }

      // ✅ TẠO MỚI TRẺ: vẫn dùng client
      else {
        const result = await addDocData({
          nameCollect: "children",
          value: {
            ...data,
            avatar: "",
            createAt: serverTimestamp(),
            updateAt: serverTimestamp(),
          },
          metaDoc: "children",
        });

        let avatar = "";

        if (avatarFile) {
          const resultAvatar = await uploadChildAvatar(avatarFile, result.id);
          avatar = resultAvatar?.avatar || "";
        }

        addChild({
          ...data,
          id: result.id,
          avatar,
        });

        handleToastSuccess(`Thêm trẻ mới thành công!`);
      }

      resetData();
    } catch (err: any) {
      console.error(err);

      if (err.code === "functions/permission-denied") {
        handleToastError("Chỉ admin mới có quyền cập nhật trẻ");
      } else if (err.code === "functions/not-found") {
        handleToastError("Không tìm thấy trẻ");
      } else {
        handleToastError(
          childEdit ? "Cập nhật trẻ thất bại" : "Thêm trẻ mới thất bại",
        );
      }
    } finally {
      setLoadingOverLay(false);
    }
  };
  const handleSelectedChild = (id: string) => {
    if (id.trim() === "") {
      resetData();
      return;
    }

    const child = children.find((child) => child.id === id);

    setChildEdit(child);
  };
  const onDeleteChild = () => {
    const isConfirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa trẻ này?\n\nDữ liệu sau khi xóa sẽ không thể khôi phục.",
    );

    if (!isConfirmed) return;

    handleDeleteChild();
  };
  // XÓA trẻ

  const handleDeleteChild = async () => {
    if (!childEdit) return;

    onClose()
    setLoadingOverLay(true);

    try {
      const deleteChildDeep = httpsCallable<
        { childId: string },
        {
          ok: boolean;
          deletedChildId: string;
          deleted: {
            carts: number;
            plans: number;
            planTasks: number;
            reports: number;
            reportTasks: number;
            reportSaveds: number;
          };
          deletedPlansCount: number;
          deletedReportsCount: number;
        }
      >(functions, "deleteChildDeep");

      const res = await deleteChildDeep({
        childId: childEdit.id,
      });

      removeChild(childEdit.id)

      setChildEdit(undefined);
      setForm(initialForm);
      setSelectTeachers([]);

      const deleted = res.data.deleted;

      handleToastSuccess(
        `Xóa trẻ thành công! Đã xóa
        ${deleted.plans} kế hoạch,
        ${deleted.planTasks} chi tiết kế hoạch,
        ${deleted.reports} báo cáo,
        ${deleted.reportTasks} chi tiết báo cáo,
        ${deleted.carts} giỏ nháp,
        ${deleted.reportSaveds} chi tiết báo cáo nháp`,
      );
    } catch (err: any) {
      console.error(err);

      if (err.code === "functions/permission-denied") {
        handleToastError("Chỉ admin mới có quyền xóa trẻ");
      } else if (err.code === "functions/not-found") {
        handleToastError("Không tìm thấy trẻ");
      } else if (err.code === "functions/unauthenticated") {
        handleToastError("Bạn cần đăng nhập lại");
      } else {
        handleToastError("Xóa trẻ thất bại");
      }
    } finally {
      setLoadingOverLay(false);
    }
  };

  return (
    <div
      className="ak-child-modal-overlay"
      role="presentation"
      onMouseDown={resetAndClose}
    >
      <section
        className="ak-child-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ak-child-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="ak-child-modal-header">
          <button
            className="ak-child-back"
            type="button"
            onClick={resetAndClose}
            aria-label="Quay lại"
            disabled={loading}
          >
            <i className="bi bi-chevron-left" />
          </button>

          <div className="ak-child-heading">
            <h2 id="ak-child-modal-title">
              {isAddChild ? "Thêm trẻ mới" : "Chỉnh sửa thông tin trẻ"}
            </h2>
            <p>
              {isAddChild
                ? "Nhập thông tin cơ bản để tạo hồ sơ cho trẻ"
                : "Thay đổi, cập nhật thông tin mới cho trẻ"}
            </p>
          </div>
          <div
            style={{
              fontSize: "24px",
              cursor: "pointer",
            }}
            title={`Chuyển chế độ ${isAddChild ? "chỉnh sửa" : "thêm mới"} thông tin trẻ`}
            onClick={() => setIsAddChild(!isAddChild)}
          >
            <i className={`bi bi-${isAddChild ? "pencil" : "person-add"}`}></i>
          </div>

          <button
            className="ak-child-close"
            type="button"
            onClick={resetAndClose}
            aria-label="Đóng"
            disabled={loading}
          >
            <i className="bi bi-x-lg" />
          </button>
        </header>

        <form
          id="ak-add-child-form"
          className="ak-child-form"
          onSubmit={handleSubmit}
        >
          {!isAddChild && (
            <div className="ak-child-avatar-section">
              <div
                className="ak-child-avatar-info"
                style={{
                  width: "100%",
                }}
              >
                <label>
                  Chọn trẻ
                  <strong>*</strong>
                </label>
                <select
                  className="form-select mb-3"
                  onChange={(e) => handleSelectedChild(e.target.value)}
                  disabled={loading}
                >
                  <option value="">Danh sách trẻ</option>
                  {children.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.fullName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="ak-child-avatar-section">
            <div className="ak-child-avatar-preview">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Ảnh đại diện của trẻ" />
              ) : (
                <div className="ak-child-avatar-placeholder">
                  <i className="bi bi-person" />
                </div>
              )}

              <label className="ak-child-avatar-button">
                <i className="bi bi-camera-fill" />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={loading}
                />
              </label>
            </div>

            <div className="ak-child-avatar-info">
              <h3>Ảnh đại diện</h3>
              <p>Chọn ảnh rõ khuôn mặt để dễ nhận biết hồ sơ.</p>

              {avatarPreview && (
                <button
                  type="button"
                  className="ak-child-remove-avatar"
                  onClick={removeAvatar}
                  disabled={loading}
                >
                  <i className="bi bi-trash3" />
                  Xóa ảnh
                </button>
              )}
            </div>
          </div>

          <div className="ak-child-section">
            <div className="ak-child-section-title">
              <span>
                <i className="bi bi-person-vcard" />
              </span>

              <div>
                <h3>Thông tin của trẻ</h3>
                <p>Các thông tin nhận diện cơ bản</p>
              </div>
            </div>

            <div className="ak-child-form-grid">
              <div className="ak-child-field ak-child-field-full">
                <label htmlFor="child-full-name">
                  Họ và tên trẻ
                  <strong>*</strong>
                </label>

                <div
                  className={`ak-child-input ${errors.fullName ? "error" : ""}`}
                >
                  <i className="bi bi-person" />

                  <input
                    id="child-full-name"
                    type="text"
                    value={form.fullName}
                    onChange={(event) =>
                      updateField("fullName", event.target.value)
                    }
                    placeholder="Ví dụ: Nguyễn Minh Anh"
                    disabled={loading}
                  />
                </div>

                {errors.fullName && (
                  <span className="ak-child-error">{errors.fullName}</span>
                )}
              </div>

              <div className="ak-child-field">
                <label htmlFor="child-nickname">Tên thường gọi</label>

                <div className="ak-child-input">
                  <i className="bi bi-emoji-smile" />

                  <input
                    id="child-nickname"
                    type="text"
                    value={form.nickName}
                    onChange={(event) =>
                      updateField("nickName", event.target.value)
                    }
                    placeholder="Ví dụ: Bông"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="ak-child-field">
                <label htmlFor="child-birthday">
                  Ngày sinh
                  <strong>*</strong>
                </label>

                <div
                  className={`ak-child-input ${errors.birthday ? "error" : ""}`}
                >
                  <i className="bi bi-calendar3" />

                  <input
                    id="child-birthday"
                    type="date"
                    value={form.birthday}
                    onChange={(event) =>
                      updateField("birthday", event.target.value)
                    }
                    disabled={loading}
                  />
                </div>

                {errors.birthday && (
                  <span className="ak-child-error">{errors.birthday}</span>
                )}
              </div>

              <div className="ak-child-field ak-child-field-full">
                <label>
                  Giới tính
                  <strong>*</strong>
                </label>

                <div className="ak-child-gender-options">
                  <label
                    className={`ak-child-gender-card ${
                      form.gender === "Nam" ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={form.gender === "Nam"}
                      onChange={() => updateField("gender", "Nam")}
                      disabled={loading}
                    />

                    <span className="ak-child-gender-icon">
                      <i className="bi bi-gender-male" />
                    </span>

                    <span>Nam</span>
                  </label>

                  <label
                    className={`ak-child-gender-card ${
                      form.gender === "Nữ" ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value="Nữ"
                      checked={form.gender === "Nữ"}
                      onChange={() => updateField("gender", "Nữ")}
                      disabled={loading}
                    />

                    <span className="ak-child-gender-icon">
                      <i className="bi bi-gender-female" />
                    </span>

                    <span>Nữ</span>
                  </label>

                  <label
                    className={`ak-child-gender-card ${
                      form.gender === "other" ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value="other"
                      checked={form.gender === "other"}
                      onChange={() => updateField("gender", "other")}
                      disabled={loading}
                    />

                    <span className="ak-child-gender-icon">
                      <i className="bi bi-person" />
                    </span>

                    <span>Khác</span>
                  </label>
                </div>

                {errors.gender && (
                  <span className="ak-child-error">{errors.gender}</span>
                )}
              </div>

              <div className="ak-child-field ak-child-field-full">
                <label>
                  Giáo viên phụ trách
                  <strong>*</strong>
                </label>
                <Select
                  className="mb-2"
                  getOptionLabel={(option) => option.fullName}
                  getOptionValue={(option) => option.id.toString()}
                  isMulti
                  options={teachers}
                  value={selectTeachers}
                  onChange={(value: MultiValue<OptionType>) => {
                    setSelectTeachers(value as OptionType[]);
                  }}
                />
                {errors.teacherIds && (
                  <span className="ak-child-error">{errors.teacherIds}</span>
                )}
              </div>

              <div className="ak-child-field ak-child-field-full">
                <label>
                  Trạng thái
                  <strong>*</strong>
                </label>
                <select
                  className="form-select mb-3"
                  value={form.status}
                  onChange={(e) => updateField("status", e.target.value)}
                  disabled={loading}
                >
                  <option value={"studying"}>Đang học</option>
                  <option value={"paused"}>Tạm dừng</option>
                </select>
              </div>
            </div>
          </div>

          {/* <div className="ak-child-section">
            <div className="ak-child-section-title">
              <span>
                <i className="bi bi-people" />
              </span>

              <div>
                <h3>Thông tin phụ huynh</h3>
                <p>Thông tin dùng để liên hệ và trao đổi</p>
              </div>
            </div>

            <div className="ak-child-form-grid">
              <div className="ak-child-field">
                <label htmlFor="parent-name">
                  Tên phụ huynh
                  <strong>*</strong>
                </label>

                <div
                  className={`ak-child-input ${
                    errors.parentName ? "error" : ""
                  }`}
                >
                  <i className="bi bi-person-heart" />

                  <input
                    id="parent-name"
                    type="text"
                    value={form.parentName}
                    onChange={(event) =>
                      updateField("parentName", event.target.value)
                    }
                    placeholder="Nhập họ tên phụ huynh"
                    disabled={loading}
                  />
                </div>

                {errors.parentName && (
                  <span className="ak-child-error">
                    {errors.parentName}
                  </span>
                )}
              </div>

              <div className="ak-child-field">
                <label htmlFor="parent-phone">
                  Số điện thoại
                  <strong>*</strong>
                </label>

                <div
                  className={`ak-child-input ${
                    errors.parentPhone ? "error" : ""
                  }`}
                >
                  <i className="bi bi-telephone" />

                  <input
                    id="parent-phone"
                    type="tel"
                    inputMode="tel"
                    value={form.parentPhone}
                    onChange={(event) =>
                      updateField(
                        "parentPhone",
                        event.target.value.replace(/[^\d+\s]/g, ""),
                      )
                    }
                    placeholder="Nhập số điện thoại"
                    disabled={loading}
                  />
                </div>

                {errors.parentPhone && (
                  <span className="ak-child-error">
                    {errors.parentPhone}
                  </span>
                )}
              </div>

              <div className="ak-child-field ak-child-field-full">
                <label htmlFor="child-address">Địa chỉ</label>

                <div className="ak-child-input">
                  <i className="bi bi-geo-alt" />

                  <input
                    id="child-address"
                    type="text"
                    value={form.address}
                    onChange={(event) =>
                      updateField("address", event.target.value)
                    }
                    placeholder="Nhập địa chỉ hiện tại"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="ak-child-section">
            <div className="ak-child-section-title">
              <span>
                <i className="bi bi-journal-medical" />
              </span>

              <div>
                <h3>Thông tin tiếp nhận</h3>
                <p>Ngày bắt đầu và ghi chú ban đầu</p>
              </div>
            </div>

            <div className="ak-child-form-grid">
              <div className="ak-child-field">
                <label htmlFor="child-start-date">
                  Ngày bắt đầu học
                </label>

                <div className="ak-child-input">
                  <i className="bi bi-calendar-check" />

                  <input
                    id="child-start-date"
                    type="date"
                    value={form.startDate}
                    onChange={(event) =>
                      updateField("startDate", event.target.value)
                    }
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="ak-child-field ak-child-field-full">
                <label htmlFor="child-note">Ghi chú ban đầu</label>

                <div className="ak-child-textarea">
                  <textarea
                    id="child-note"
                    value={form.note}
                    onChange={(event) =>
                      updateField("note", event.target.value)
                    }
                    placeholder="Nhập khó khăn hiện tại, nhu cầu của gia đình hoặc những lưu ý khi tiếp nhận trẻ..."
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div> */}
        </form>

        <footer className="ak-child-footer">
          {!isAddChild && childEdit && (
            <button
              type="button"
              className="ak-child-cancel"
              onClick={onDeleteChild}
              disabled={loading}
              style={{
                background: "red",
                color: "#fff",
              }}
            >
              Xóa trẻ
            </button>
          )}

          <button
            type="submit"
            form="ak-add-child-form"
            className="ak-child-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="ak-child-spinner" />
                Đang lưu...
              </>
            ) : (
              <>
                <i
                  className={`bi ${isAddChild ? "bi-person-plus-fill" : "bi-floppy2"}`}
                />
                {isAddChild ? "Thêm trẻ mới" : "Cập nhật"}
              </>
            )}
          </button>
        </footer>
      </section>
    </div>
  );
}
