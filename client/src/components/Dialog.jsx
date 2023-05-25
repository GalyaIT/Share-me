function Dialog({ message, onDialog }) {
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div
        className="fixed top-0 left-0 right-0 bottom-0 bg-neutral-100/75"
        onClick={() => onDialog(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="sticky top-1/2 w-3/4 m-auto
        bg-stone-100 drop-shadow-xl rounded-xl p-6 "        >
          <h3 className="text-red-500 text-sm pb-2 text-center">{message}</h3>
          <div className="flex justify-center">
            <button
              onClick={() => onDialog(true)}
              className="bg-neutral-300 text-sm text-red-500 py-1 px-3.5 mr-1 border-none cursor-pointer rounded-lg"
            >
              Yes
            </button>
            <button
              onClick={() => onDialog(false)}
              className="bg-neutral-300 text-sm text-green-500 py-1 px-3.5 border-none cursor-pointer rounded-lg"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Dialog;
