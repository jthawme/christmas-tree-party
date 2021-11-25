import { Breakpoint } from "~/assets/js/mixins/breakpoints";

export const state = () => {
  return {
    breakpoint: {
      [Breakpoint.Desktop]: true,
      [Breakpoint.LargeMobile]: true,
      [Breakpoint.Tablet]: true,
      [Breakpoint.Mobile]: true,
    },
  };
};

export const mutations = {
  setBreakpoint(state, val) {
    state.breakpoint[val.key] = val.value;
  },
};

// export const actions = {
//   async nuxtServerInit({ commit }, { env }) {
//     const sources = [
//       ...new Set(
//         allSongs.flatMap((item) =>
//           item.positions.map((p) => `${p.source}-${p.year}`)
//         )
//       ),
//     ];

//     const currentYear = new Date().getFullYear();
//     commit(
//       "setList",
//       sources.map((s) => {
//         const parts = s.split("-");
//         const year = parseInt(parts.splice(parts.length - 1, 1));
//         const baseName = parts.join("-");
//         return {
//           name: NAMES[baseName],
//           year,
//           slug: s,
//         };
//       })
//     );

//     commit("setPlaylists", allPlaylists);
//   },
// };
