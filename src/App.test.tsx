import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect, vi } from 'vitest';

// Mock components that cause ESM issues or are not needed for this test
vi.mock('./components/SvgToDrawableConverter', () => ({
    SvgToDrawableConverter: () => <div>SvgToDrawableConverter</div>
}));

describe('App', () => {
    it('renders without crashing', () => {
        render(<App />);
        const elements = screen.getAllByText(/Image Optimizer/i);
        expect(elements.length).toBeGreaterThan(0);
    });
});
