// //Samp lePage
import Home from "../Components/Pages/Analytics/Home";
import SamplePage from "../Components/Pages/PageLayout/SimplePage";
import Sample from "../Components/Pages/Sample";
import FileManager from "../Components/Pages/filemanager";
import NotePad from "../Components/Pages/notepad";
import WhiteBoard from "../Components/Pages/whiteboard";

export const routes = [
  // //page
  {
    path: `${process.env.PUBLIC_URL}/pages/home/`,
    Component: Sample,
  },
  {
    path: `${process.env.PUBLIC_URL}/pages/white-board/`,
    Component: WhiteBoard,
  },
  {
    path: `${process.env.PUBLIC_URL}/pages/note-pad/`,
    Component: NotePad,
  },
  {
    path: `${process.env.PUBLIC_URL}/pages/file-manager/`,
    Component: FileManager,
  },
  {
    path: `${process.env.PUBLIC_URL}/analytics/home/`,
    Component: Home,
  },
];
