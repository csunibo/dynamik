import * as React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { SearchIcon, FilterIcon } from "@heroicons/react/outline";
import { useDebounce } from "use-debounce";
import Fuse from "fuse.js";

import type { FuzzyFile } from "statik";

export interface FuzzyContextValue {
  data?: FuzzyFile[];
  error?: string;
  open: boolean;
}

const debounceInterval = 250;

export const FuzzyContext = React.createContext<
  [FuzzyContextValue, React.Dispatch<FuzzyContextValue>]
>([
  {
    data: [],
    open: false,
  },
  void 0 as any,
]);

const Fuzzy: React.FC = () => {
  let [fuzzy, setFuzzy] = React.useContext(FuzzyContext);
  const close = React.useCallback(() => {
    setFuzzy({ ...fuzzy, open: false });
  }, [fuzzy]);
  const [query, setQuery] = React.useState("");
  const fuse = React.useMemo(
    () =>
      new Fuse(fuzzy.data || [], {
        shouldSort: true,
        keys: ["name", "path", "mime"],
      }),
    [fuzzy.data]
  );
  const [debouncedQuery] = useDebounce<string>(query, debounceInterval);
  const results = React.useMemo(
    () => fuse.search(debouncedQuery),
    [fuse, debouncedQuery]
  );

  return (
    <Transition appear show={fuzzy.open} as={React.Fragment}>
      <Dialog as="div" className="relative z-10" onClose={close}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h2"
                  className="flex items-center justify-center px-4 py-3 border-b-2 border-slate-100"
                >
                  <SearchIcon className="w-6 h-6 mr-4" />
                  <input
                    type="text"
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 border-1 p-2 text-xl border-none focus:ring-0 focus-visible:outline-none"
                  />
                </Dialog.Title>
                {results.length == 0 ? (
                  <Dialog.Description
                    as="div"
                    className="flex flex-col items-center justify-center h-64 lg:h-96"
                  >
                    <FilterIcon className="w-32 h-32 stroke-1" />
                    <h4 className="text-xl font-semibold my-4">
                      Start searching for files
                    </h4>
                  </Dialog.Description>
                ) : (
                  <Dialog.Description
                    as="div"
                    className="flex flex-col items-center justify-center h-64 lg:h-96 overflow-y-auto"
                  >
                    <ul>
                      {results.map((result) => (
                        <li key={result.refIndex}>{result.item.name}</li>
                      ))}
                    </ul>
                  </Dialog.Description>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Fuzzy;
