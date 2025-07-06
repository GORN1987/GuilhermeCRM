import { render, screen } from '@testing-library/react'

import { it, expect, describe } from 'vitest'
import LoginForm from './login-page'

describe("Nice", () => {
    it("should validate login", () => {
        expect(1).toBeTruthy();
    })

    it("should validate login", () => {
        render(<LoginForm />);
        screen.getByText("Login test");
    })
})