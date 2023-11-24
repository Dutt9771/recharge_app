// ----------------------------------------------------------------------

export default function Autocomplete(theme) {
	return {
		MuiAutocomplete: {
			styleOverrides: {
				paper: {
					boxShadow: theme.customShadows.z20,
				},
				option: {
					fontSize: "13px",
				},
			},
		},
	};
}
