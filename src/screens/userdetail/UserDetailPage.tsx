import { where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { updateDocData } from "../../constants/firebase/updateDocData";
import {
  handleToastError,
  handleToastSuccess,
} from "../../constants/handleToast";
import { uploadTeacherAvatar } from "../../constants/uploadAvatar";
import { useFirestoreWithMetaCondition } from "../../constants/useFirestoreWithMetaCondition";
import {
  useLoadingOverLayStore,
  usePlanStore,
  useReportStore,
  useUserStore,
} from "../../zustand";
import "./UserDetailPage.css";
import { getTimeMs, icon512 } from "../../constants/info";

const defaultUser = {
  fullName: "",
  position: "",
  email: "",
  phone: "",
  birthday: "",
  gender: "",
  address: "",
  department: "",
  qualification: "",
  startDate: "",
  bio: "",
  avatar: "",
};

export default function UserDetailPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(defaultUser);
  // const [avatarPreview, setAvatarPreview] = useState(defaultUser.avatar);
  const fileInputRef = useRef<any>(null);

  // const joinedText = useMemo(() => {
  //   if (!form.startDate) return "Chưa cập nhật";
  //   const [year, month, day] = form.startDate.split("-");
  //   return `${day}/${month}/${year}`;
  // }, [form.startDate]);

  // const handleAvatarChange = (event) => {
  //   const file = event.target.files?.[0];
  //   if (!file) return;

  //   const imageUrl = URL.createObjectURL(file);
  //   setAvatarPreview(imageUrl);
  // };

  const handleCancel = () => {
    setForm(defaultUser);
    // setAvatarPreview(defaultUser.avatar);
    setIsEditing(false);
  };

  const handleSave = (event: any) => {
    event.preventDefault();
    setShowUpdate(true);
  };

  const { user, setUser } = useUserStore();
  const [showUpdate, setShowUpdate] = useState(false);
  const { setLoadingOverLay } = useLoadingOverLayStore();
  const { plans } = usePlanStore();
  const { reports } = useReportStore();

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(user?.avatar || "");

  const hasChanged =
    form.fullName.trim() !== (user?.fullName || "").trim() ||
    form.phone.trim() !== (user?.phone || "").trim() ||
    avatarFile !== null;

  const { data: childrenForTeacher } = useFirestoreWithMetaCondition({
    key: `children_teacher_${user?.id}`,
    metaDoc: "children",
    id: user?.id,
    nameCollect: "children",
    condition: [where("teacherIds", "array-contains", user?.id)],
  });

  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      email: user.email,
      fullName: user.fullName,
      position: user.position,
      phone: user.phone,
      birthday: new Date(getTimeMs(user.birth)).toISOString().split("T")[0],
    }));
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setAvatarFile(file);
    setPreviewUrl(previewUrl);
  };

  const handleUpdateInfo = async () => {
    if (!user) return;

    setShowUpdate(false);
    setLoadingOverLay(true);

    try {
      setLoadingOverLay(true);

      // Upload avatar nếu có ảnh mới
      if (avatarFile) {
        const result = await uploadTeacherAvatar(avatarFile, user.id);

        setUser((prev) =>
          prev
            ? {
                ...prev,
                avatar: result.avatar,
              }
            : null,
        );
      }

      // Chỉ update profile khi có thay đổi
      if (form.fullName !== user.fullName || form.phone !== user.phone) {
        await updateDocData({
          nameCollect: "users",
          id: user.id,
          valueUpdate: { ...user, fullName: form.fullName, phone: form.phone },
          metaDoc: "users",
        });

        setUser((prev) =>
          prev
            ? {
                ...prev,
                fullName: form.fullName,
                phone: form.phone,
              }
            : null,
        );
      }

      setAvatarFile(null);

      handleToastSuccess("Cập nhật thông tin thành công");
    } catch (error: any) {
      handleToastError("Cập nhật thông tin thất bại");
    } finally {
      setLoadingOverLay(false);
      setIsEditing(false);
    }
  };
  const handleChange = (field: any, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const stats = [
    {
      label: "Trẻ phụ trách",
      value: childrenForTeacher.length,
      icon: "bi-people",
    },
    {
      label: "Kế hoạch đã tạo",
      value: plans.length,
      icon: "bi-calendar2-check",
    },
    {
      label: "Báo cáo tháng",
      value: reports.length,
      icon: "bi-clipboard2-data",
    },
  ];

  return (
    <section className="user-detail-content">
      <div className="user-detail-bg-star one">★</div>
      <div className="user-detail-bg-star two">★</div>
      <div className="user-detail-bg-star three">★</div>

      <section className="user-profile-hero">
        <div className="user-avatar-card">
          <div className="avatar-frame">
            <img src={previewUrl || icon512} alt={"user-avatar"} />
            <button
              type="button"
              className="avatar-change-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              <i className="bi bi-camera-fill" />
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="avatar-input"
            onChange={handleAvatarChange}
          />

          <h2>{user?.fullName}</h2>
          <p>{user?.position}</p>
          <span className="user-status-badge">
            <i className="bi bi-check-circle-fill" />
            Đang hoạt động
          </span>
        </div>

        <div className="user-summary-card">
          <div className="summary-head">
            <div>
              <span>Hồ sơ giáo viên</span>
              <h3>Thông tin tổng quan</h3>
            </div>
            <button
              type="button"
              className="edit-profile-btn"
              onClick={() => setIsEditing(true)}
            >
              <i className="bi bi-pencil-square" />
              Chỉnh sửa
            </button>
          </div>

          <div className="summary-grid">
            <div>
              <small>Email</small>
              <strong>{user?.email}</strong>
            </div>
            <div>
              <small>Số điện thoại</small>
              <strong>{user?.phone}</strong>
            </div>
            <div>
              <small>Bộ phận</small>
              <strong>Đang cập nhật</strong>
            </div>
            <div>
              <small>Ngày vào làm</small>
              <strong>Đang cập nhật</strong>
            </div>
          </div>

          <div className="user-stats-row">
            {stats.map((item) => (
              <div className="user-stat-card" key={item.label}>
                <i className={`bi ${item.icon}`} />
                <div>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <form className="user-info-card" onSubmit={handleSave}>
        <div className="card-title-row">
          <div>
            <span>Cập nhật hồ sơ</span>
            <h3>Thông tin cá nhân</h3>
          </div>
          <span className={`edit-status ${isEditing ? "editing" : ""}`}>
            {isEditing ? "Đang chỉnh sửa" : "Chế độ xem"}
          </span>
        </div>

        <div className="user-form-grid">
          <label className="user-form-group">
            <span>Họ và tên</span>
            <input
              disabled={!isEditing}
              value={form.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
            />
          </label>

          <label className="user-form-group">
            <span>Chức vụ</span>
            <input
              disabled={true}
              value={form.position}
              onChange={(e) => handleChange("position", e.target.value)}
            />
          </label>

          <label className="user-form-group">
            <span>Email</span>
            <input
              disabled={true}
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </label>

          <label className="user-form-group">
            <span>Số điện thoại</span>
            <input
              disabled={!isEditing}
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </label>

          <label className="user-form-group">
            <span>Ngày sinh</span>
            <input
              disabled={!isEditing}
              type="date"
              value={form.birthday}
              onChange={(e) => handleChange("birthday", e.target.value)}
            />
          </label>

          <label className="user-form-group">
            <span>Giới tính</span>
            <select
              disabled={!isEditing}
              value={form.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
            >
              <option>Nữ</option>
              <option>Nam</option>
              <option>Khác</option>
            </select>
          </label>

          <label className="user-form-group">
            <span>Bộ phận phụ trách</span>
            <input
              disabled={!isEditing}
              value={form.department}
              onChange={(e) => handleChange("department", e.target.value)}
            />
          </label>

          <label className="user-form-group">
            <span>Trình độ chuyên môn</span>
            <input
              disabled={!isEditing}
              value={form.qualification}
              onChange={(e) => handleChange("qualification", e.target.value)}
            />
          </label>

          <label className="user-form-group full">
            <span>Địa chỉ</span>
            <input
              disabled={!isEditing}
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </label>

          <label className="user-form-group full">
            <span>Giới thiệu ngắn</span>
            <textarea
              disabled={!isEditing}
              value={form.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
            />
          </label>
        </div>

        <div className="user-form-actions">
          {isEditing ? (
            <>
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancel}
              >
                Hủy
              </button>
              <button type="submit" className="save-btn">
                <i className="bi bi-check2-circle" onClick={handleSave} />
                Lưu cập nhật
              </button>
            </>
          ) : (
            <button
              type="button"
              className="save-btn"
              disabled={!hasChanged}
              onClick={() => setIsEditing(true)}
            >
              <i className="bi bi-pencil-square" />
              Cập nhật thông tin
            </button>
          )}
        </div>
      </form>

      {showUpdate && (
        <div className="custom-modal-backdrop">
          <div className="custom-modal">
            {/* Title */}
            <h5 className="fw-black text-danger mb-2">
              Xác nhận cập nhật thông tin
            </h5>

            {/* Description */}
            <p className="text-green-muted small">
              Hành động này sẽ cập nhật lại những thay đổi về thông tin cá nhân
              của mình. Cô chắc chắn chứ ?
            </p>

            {/* Actions */}
            <div className="d-flex gap-2 justify-content-end mt-3">
              <button
                className="btn action-btn-soft"
                onClick={() => setShowUpdate(false)}
              >
                Huỷ
              </button>

              <button className="btn submit-btn" onClick={handleUpdateInfo}>
                <i className="bi bi-check2-all me-2" />
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
