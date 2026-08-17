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
import {
  uploadChildAvatar,
  uploadTeacherAvatar,
} from "../../../constants/uploadAvatar";
import { functions } from "../../../firebase.config";
import { ChildrenModel, UserModel } from "../../../models";
import { useChildrenStore, useLoadingOverLayStore, useTeacherStore } from "../../../zustand";
import "./AddTeacherModal.css";
import { updateDocData } from "../../../constants/firebase/updateDocData";

export type NewTeacherForm = {
  fullName: string;
  shortName: string;
  birthday: string;
  gender: string;
  position: string;
  role: string;
  telegramChatId: string;

  avatarFile: File | null;
};
interface OptionType {
  id: string;
  fullName: string;
}
type AddTeacherModalProps = {
  teachers: UserModel[];
  show: boolean;
  onClose: () => void;
  loading?: boolean;
};

const initialForm: NewTeacherForm = {
  fullName: "",
  role: "",
  birthday: "",
  gender: "",
  //   parentName: "",
  //   parentPhone: "",
  //   address: "",
  //   startDate: "",
  //   note: "",
  avatarFile: null,
  shortName: "",
  position: "",
  telegramChatId: "",
};

export default function AddTeacherModal({
  teachers,
  show,
  onClose,
  loading = false,
}: AddTeacherModalProps) {
  const [form, setForm] = useState<NewTeacherForm>(initialForm);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { setLoadingOverLay } = useLoadingOverLayStore();
  const [teacherEdit, setTeacherEdit] = useState<UserModel>();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { editTeacher, removeTeacher } = useTeacherStore();

  const errors = useMemo(() => {
    return {
      fullName:
        submitted && !form.fullName.trim()
          ? "Vui lòng nhập họ và tên giáo viên."
          : "",
      position:
        submitted && !form.position ? "Vui lòng chọn vị trí giáo viên." : "",
      role: submitted && !form.role ? "Vui lòng chọn vai trò giáo viên." : "",
    };
  }, [form, submitted]);

  const isValid =
    form.fullName.trim() !== "" &&
    form.position.trim() !== "" &&
    form.role.trim() !== "";

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
    if (teacherEdit) {
      setForm({
        fullName: teacherEdit.fullName,
        shortName: teacherEdit.shortName || "",
        gender: teacherEdit.gender || "",
        position: teacherEdit.position || "",
        role: teacherEdit.role || "",
        birthday: stringToDateInput(teacherEdit.birth),
        avatarFile: null,
        telegramChatId: teacherEdit.telegramChatId || "",
      });
      setAvatarPreview(teacherEdit.avatar);
    }
  }, [teacherEdit]);

  if (!show) return null;

  const updateField = <K extends keyof NewTeacherForm>(
    field: K,
    value: NewTeacherForm[K],
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
    setTeacherEdit(undefined);
  };
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);

    if (!isValid || loading || !teacherEdit) return;

    const data = {
      fullName: form.fullName,
      avatar: avatarPreview || icon512,

      shortName: form.shortName,
      birth: dateInputToString(form.birthday),
      gender: form.gender,
      role: form.role,
      position: form.position,
      telegramChatId: form.telegramChatId,

      createAt: Date.now(),
      updateAt: Date.now(),
    };

    onClose();
    setLoadingOverLay(true);

    try {
      setLoadingOverLay(false);
      setLoadingOverLay(true);

      await updateDocData({
        nameCollect: "users",
        id: teacherEdit.id,
        valueUpdate: {
          ...data,
          updateAt: serverTimestamp(),
        },
        metaDoc: "users",
      });

      editTeacher(teacherEdit.id, {
        ...data,
        createAt: new Date(),
        updateAt: new Date(),
      });

      handleToastSuccess(
        `Chỉnh sửa giáo viên thành công! (${teacherEdit.fullName})`,
      );

      resetData();
    } catch (err: any) {
      console.error(err);

      switch (err.code) {
        case "functions/permission-denied":
          handleToastError("Chỉ admin mới có quyền cập nhật giáo viên");
          break;

        case "functions/not-found":
          handleToastError("Không tìm thấy giáo viên");
          break;

        default:
          handleToastError("Cập nhật giáo viên thất bại");
          break;
      }
    } finally {
      setLoadingOverLay(false);
    }
  };
  const handleSelectedTeacher = (id: string) => {
    if (id.trim() === "") {
      resetData();
      return;
    }

    const teacher = teachers.find((teacher) => teacher.id === id);

    setTeacherEdit(teacher);
  };
  const onDeleteTeacher = () => {
    const isConfirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa giáo viên này?\n\nDữ liệu sau khi xóa sẽ không thể khôi phục.",
    );

    if (!isConfirmed) return;

    handleDeleteChild();
  };
  // XÓA giáo viên

  const handleDeleteChild = async () => {
    if (!teacherEdit) return;

    onClose();
    setLoadingOverLay(true);

    try {
      const deleteTeacherDeep = httpsCallable<
        { teacherId: string },
        {
          ok: boolean;
          deletedTeacherId: string;
          updatedCount: number;
          synced: {
            children?: { removedTeacherIds: number };
            carts?: { removedTeacherIds: number; clearedAuthorId: number };
            plans?: { removedTeacherIds: number; clearedAuthorId: number };
            planTasks?: { removedTeacherIds: number; clearedAuthorId: number };
            reports?: { removedTeacherIds: number; clearedAuthorId: number };
            reportTasks?: {
              removedTeacherIds: number;
              clearedAuthorId: number;
            };
            reportSaveds?: {
              removedTeacherIds: number;
              clearedAuthorId: number;
            };
          };
        }
      >(functions, "deleteTeacherDeep");

      const res = await deleteTeacherDeep({
        teacherId: teacherEdit.id,
      });

      
      removeTeacher(teacherEdit.id)

      setTeacherEdit(undefined);
      setForm(initialForm);

      handleToastSuccess(
        `Xóa giáo viên thành công! Đã cập nhật ${res.data.updatedCount} mục liên quan.`,
      );

      console.log("Chi tiết dữ liệu đã cập nhật:", res.data.synced);
    } catch (err: any) {
      console.error(err);

      if (err.code === "functions/permission-denied") {
        handleToastError("Chỉ admin mới có quyền xóa giáo viên");
      } else if (err.code === "functions/not-found") {
        handleToastError("Không tìm thấy giáo viên");
      } else if (err.code === "functions/unauthenticated") {
        handleToastError("Bạn cần đăng nhập lại");
      } else {
        handleToastError("Xóa giáo viên thất bại");
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
            <h2 id="ak-child-modal-title">Chỉnh sửa thông tin giáo viên</h2>
            <p>Thay đổi, cập nhật thông tin mới cho giáo viên</p>
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
          <div className="ak-child-avatar-section">
            <div
              className="ak-child-avatar-info"
              style={{
                width: "100%",
              }}
            >
              <label>
                Chọn giáo viên
                <strong>*</strong>
              </label>
              <select
                className="form-select mb-3"
                onChange={(e) => handleSelectedTeacher(e.target.value)}
                disabled={loading}
              >
                <option value="">Danh sách giáo viên</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="ak-child-avatar-section">
            <div className="ak-child-avatar-preview">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Ảnh đại diện của giáo viên" />
              ) : (
                <div className="ak-child-avatar-placeholder">
                  <i className="bi bi-person" />
                </div>
              )}

              {/* <label className="ak-child-avatar-button">
                <i className="bi bi-camera-fill" />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={loading}
                />
              </label> */}
            </div>

            <div className="ak-child-avatar-info">
              <h3>Ảnh đại diện</h3>
              <p>Chọn ảnh rõ khuôn mặt để dễ nhận biết hồ sơ.</p>

              {/* {avatarPreview && (
                <button
                  type="button"
                  className="ak-child-remove-avatar"
                  onClick={removeAvatar}
                  disabled={loading}
                >
                  <i className="bi bi-trash3" />
                  Xóa ảnh
                </button>
              )} */}
            </div>
          </div>

          <div className="ak-child-section">
            <div className="ak-child-section-title">
              <span>
                <i className="bi bi-person-vcard" />
              </span>

              <div>
                <h3>Thông tin của giáo viên</h3>
                <p>Các thông tin nhận diện cơ bản</p>
              </div>
            </div>

            <div className="ak-child-form-grid">
              <div className="ak-child-field ak-child-field-full">
                <label htmlFor="child-full-name">
                  Họ và tên giáo viên
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
                    value={form.shortName}
                    onChange={(event) =>
                      updateField("shortName", event.target.value)
                    }
                    placeholder="Ví dụ: Bông"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="ak-child-field">
                <label htmlFor="child-birthday">Ngày sinh</label>

                <div className={`ak-child-input`}>
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
              </div>

              <div className="ak-child-field ak-child-field-full">
                <label>Giới tính</label>

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
              </div>

              <div className="ak-child-field ak-child-field-full">
                <label>
                  Vị trí
                  <strong>*</strong>
                </label>
                <select
                  className="form-select mb-3"
                  value={form.position}
                  onChange={(e) => updateField("position", e.target.value)}
                  disabled={loading}
                >
                  <option value={"Chuyên viên Tâm lý"}>
                    Chuyên viên Tâm lý
                  </option>
                  <option value={"Giám đốc"}>Giám đốc</option>
                  <option value={"Phó Giám đốc"}>Phó Giám đốc</option>
                </select>
              </div>

              <div className="ak-child-field ak-child-field-full">
                <label>
                  Quyền
                  <strong>*</strong>
                </label>
                <select
                  className="form-select mb-3"
                  value={form.role}
                  onChange={(e) => updateField("role", e.target.value)}
                  disabled={loading}
                >
                  <option value={"admin"}>Quản trị viên</option>
                  <option value={"teacher"}>Giáo viên</option>
                </select>
              </div>

              <div className="ak-child-field">
                <label htmlFor="child-nickname">Telegram Chat ID</label>

                <div className="ak-child-input">
                  <i className="bi bi-qr-code" />

                  <input
                    id="child-nickname"
                    type="text"
                    value={form.telegramChatId}
                    onChange={(event) =>
                      updateField("telegramChatId", event.target.value)
                    }
                    placeholder="Ví dụ: 596143654"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>

        <footer className="ak-child-footer">
          {teacherEdit && (
            <button
              type="button"
              className="ak-child-cancel"
              onClick={onDeleteTeacher}
              disabled={loading}
              style={{
                background: "red",
                color: "#fff",
              }}
            >
              Xóa giáo viên
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
                <i className={`bi bi-floppy2`} />
                Cập nhật
              </>
            )}
          </button>
        </footer>
      </section>
    </div>
  );
}
