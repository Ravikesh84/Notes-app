import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import { useState, useEffect, useMemo } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/ToastMessage/Toast";

Modal.setAppElement('#root');

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [allNotes, setAllNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  const filteredNotes = useMemo(() => {
    if (!searchTerm) return allNotes;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return allNotes.filter(note => 
      note.title.toLowerCase().includes(lowerSearchTerm) ||
      note.content.toLowerCase().includes(lowerSearchTerm) ||
      note.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm))
    );
  }, [allNotes, searchTerm]);

  const handleSearch = (query) => {
    setSearchTerm(query);
  };

  const handleEdit = (noteDetails) =>{
    setOpenAddEditModal ({isShown: true, data: noteDetails, type: "edit"});
  };

  const showToastMessage = (message, type) =>{
    setShowToastMsg({
      isShown: true,
      message: message,
      type: type || "success"
    });
  };

  const handleCloseToast = () =>{
    setShowToastMsg({
      isShown: false,
      message: "",
      type: "success"
    });
  };
  // Get User Info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Get All notes
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");
      if (response.data && response.data.notes) {
        console.log('Notes received:', response.data.notes);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      showToastMessage("Failed to fetch notes", "error");
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();

    return () => {};
  }, [navigate]);

  const handleDelete = async (noteId) => {
    try {
      const response = await axiosInstance.delete(`/delete-note/${noteId}`);
      if (response.data) {
        showToastMessage("Note deleted successfully", "success");
        getAllNotes();
      }
    } catch (error) {
      showToastMessage("Failed to delete note", "error");
    }
  };

  const handlePinNote = async (noteId, currentPinStatus) => {
    try {
      const response = await axiosInstance.put(`/update-note-pinned/${noteId}`, {
        isPinned: !currentPinStatus
      });
      if (response.data) {
        showToastMessage("Note pin status updated", "success");
        getAllNotes();
      }
    } catch (error) {
      console.error('Pin error:', error);
      showToastMessage("Failed to update pin status", "error");
    }
  };

  return (
    <>
      <Navbar 
        userInfo={userInfo} 
        onSearch={handleSearch}
      />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-3 gap-4 mt-8 auto-rows-min">
          {filteredNotes.map((item, index) => (
            <NoteCard
              key={item._id}
              title={item.title}
              date={item.createdAt}
              content={item.content || ''}
              tags={item.tags || []}
              isPinned={item.isPinned}
              onEdit={() => handleEdit(item)}
              onDelete={() => handleDelete(item._id)}
              onPinNote={() => handlePinNote(item._id, item.isPinned)}
            />
          ))}
        </div>
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>
      
      <Toast
      isShown={showToastMsg.isShown}
      message={showToastMsg.message}
      type={showToastMsg.type}
      onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;
