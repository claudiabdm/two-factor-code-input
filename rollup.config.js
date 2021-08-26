import html from '@web/rollup-plugin-html';

export default [{
	input: 'src/index.html',
	output: { dir: 'dist' },
	plugins: [html({ minify: true })],
}];
