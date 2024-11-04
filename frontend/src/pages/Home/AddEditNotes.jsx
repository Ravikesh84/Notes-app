import { useState } from "react";
import TagInput from "../../components/Input/TagInput";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";

const AddEditNotes = ({ noteData, type, getAllNotes, onClose, showToastMessage }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  //Add Note 
  const addNewNote = async () =>{
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/add-note", {
        title,
        content,
        tags,
      });
      if(response.data && response.data.note){
        showToastMessage("Note Added Successfully")
          getAllNotes()
          onClose()
      }
    } catch (error) {
      if(
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  //Edit Note
  const editNote = async () =>{
    setIsLoading(true);
    const noteId = noteData._id
    console.log('Editing note:', { noteId, title, content, tags });
    
    try {
      const response = await axiosInstance.put(`/edit-note/${noteId}`, {
        title,
        content,
        tags,
      });
      console.log('Edit response:', response.data);
      if(response.data && response.data.note){
        showToastMessage("Note Updated Successfully")
          getAllNotes();
          onClose();
      }
    } catch (error) {
      console.error('Edit error:', error);
      if(
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  

  const handleAddNote = () =>{
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    
    if(!trimmedTitle) {
      setError("Please enter the title");
      return;
    }
    if(!trimmedContent){
      setError("Please enter the content");
      return;
    }
    setError("");
    
    if(type === 'edit'){
      editNote()
    } else {
      addNewNote()
    }
  };

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400 " />
      </button>

      <div className="flex flex-col gap-2">
        <label className="input-label">Title</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="Enter title here..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">CONTENT</label>
        <textarea
          type="text"
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="Content"
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="mt-3">
        <label className="input-label">TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

        {error && <p className="text-red-500 text-xs pt-4">{error}</p>}
      <button
        className="btn-primary font-medium mt-5 p-3"
        onClick={handleAddNote}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : type === "edit" ? "UPDATE" : "ADD"}
      </button>
    </div>
  );
};

export default AddEditNotes;
