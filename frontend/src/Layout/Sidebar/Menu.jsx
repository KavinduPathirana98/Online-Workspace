export const MENUITEMS = [
  {
    menutitle: "General",
    menucontent: "Dashboards,Widgets",
    Items: [
      {
        title: "Pages",
        icon: "sample-page",
        type: "sub",
        children: [
          {
            active: false,
            path: `${process.env.PUBLIC_URL}/pages/white-board`,
            title: "White Board",
            type: "link",
          },
          {
            active: false,
            path: `${process.env.PUBLIC_URL}/pages/note-pad`,
            title: "Note Pad",
            type: "link",
          },
          {
            active: false,
            path: `${process.env.PUBLIC_URL}/pages/file-manager`,
            title: "File Manager",
            type: "link",
          },
        ],
      },

      // {
      //   title: "Support Ticket",
      //   icon: "support-tickets",
      //   type: "sub",
      //   children: [
      //     {
      //       active: false,
      //       path: `http://support.pixelstrap.com/help-center`,
      //       title: "Rise Ticket",
      //       type: "link",
      //     },
      //   ],
      // },
    ],
  },
];
