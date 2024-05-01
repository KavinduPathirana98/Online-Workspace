// //Samp lePage
import SamplePage from "../Components/Pages/PageLayout/SimplePage";
import FileManager from "../Components/Pages/filemanager";
import NotePad from "../Components/Pages/notepad";
import WhiteBoard from "../Components/Pages/whiteboard";

export const routes = [
  // //page
  {
    path: `${process.env.PUBLIC_URL}/pages/sample-page/:layout`,
    Component: SamplePage,
  },
  {
    path: `${process.env.PUBLIC_URL}/pages/white-board/:layout`,
    Component: WhiteBoard,
  },
  {
    path: `${process.env.PUBLIC_URL}/pages/note-pad/:layout`,
    Component: NotePad,
  },
  {
    path: `${process.env.PUBLIC_URL}/pages/file-manager/:layout`,
    Component: FileManager,
  },
];
