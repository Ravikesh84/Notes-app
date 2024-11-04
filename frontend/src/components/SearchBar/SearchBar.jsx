import { MdSearch, MdClose } from "react-icons/md";

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-lg w-96">
      <MdSearch className="text-xl text-slate-500" />
      <input
        type="text"
        placeholder="Search notes..."
        className="bg-transparent outline-none text-sm w-full"
        value={value}
        onChange={onChange}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
      />
      {value && (
        <MdClose
          className="text-xl text-slate-500 cursor-pointer"
          onClick={onClearSearch}
        />
      )}
    </div>
  );
};

export default SearchBar;
