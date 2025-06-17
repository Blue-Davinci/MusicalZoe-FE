import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import Page from './(home)/+page.svelte';

describe('/(home)/+page.svelte', () => {
	test('should render homepage with Musical Zoe heading', () => {
		render(Page);
		expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
		expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Musical Zoe');
	});
});
