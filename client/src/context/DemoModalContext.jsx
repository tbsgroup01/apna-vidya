import React, { createContext, useContext, useState } from "react";
import DemoModal from "../features/user/components/DemoModal";

const DemoModalContext = createContext(null);

export const DemoModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");

  const openDemoModal = (courseName = "") => {
    setSelectedCourse(courseName);
    setIsOpen(true);
  };

  const closeDemoModal = () => {
    setIsOpen(false);
    setSelectedCourse("");
  };

  return (
    <DemoModalContext.Provider
      value={{
        isDemoModalOpen: isOpen,
        openDemoModal,
        closeDemoModal,
      }}
    >
      {children}
      <DemoModal
        isOpen={isOpen}
        onClose={closeDemoModal}
        initialCourse={selectedCourse}
      />
    </DemoModalContext.Provider>
  );
};

export const useDemoModal = () => {
  const context = useContext(DemoModalContext);
  if (!context) {
    throw new Error("useDemoModal must be used within a DemoModalProvider");
  }
  return context;
};
