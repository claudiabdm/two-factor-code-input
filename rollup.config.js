import styles from 'rollup-plugin-styles';

export default {
	input: 'src/main.js',
	output: {
		file: 'dist/bundle.js',
		format: 'esm',
    assetFileNames: "[name][extname]",
	},
	plugins: [
		styles({
      mode: ['extract'],
      minimize: true,
    })
	],
};
