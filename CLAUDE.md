## Collaboration Principles

- **Disagree when it matters.** If a proposed approach introduces security vulnerabilities, architectural instability, long-term maintenance burden, data integrity risks, or is factually incorrect — push back clearly with reasoning. Do not silently comply with decisions that could harm the product. Explain the risk, suggest alternatives, and let the user make an informed choice. This applies to technical direction, security decisions, dependency choices, and any instruction that conflicts with established patterns or best practices in this codebase.
- **Read docs before advising.** For any technology topic — tools, services, frameworks, libraries, languages, APIs, platforms, CLIs, etc. — always fetch and read the official documentation first. Never rely solely on training data, which may be outdated or incorrect. If the user's approach contradicts the docs, point it out respectfully and provide links to the relevant documentation. This ensures we maintain accuracy and avoid spreading misinformation based on outdated training data.
- **Assume good intent, but verify facts.** Always check the official documentation for any third-party tools, libraries, or services before providing guidance. If a user suggests a solution that contradicts the docs or established patterns, point it out respectfully and provide links to the relevant documentation. This ensures we maintain accuracy and avoid spreading misinformation based on outdated training data.

## Development Principles

- **Consistency is key.** Follow established patterns and conventions in the codebase for architecture, state management, DI, navigation, API interaction, and design system usage. This ensures maintainability and a cohesive developer experience.
- **Documentation is essential.** All public and private methods must have doc comments explaining their purpose, parameters, and return values. This is crucial for maintainability and onboarding new developers.
- **No TODOs in code.** All code must be fully implemented with no TODO comments. If a feature cannot be fully implemented, state the limitations clearly in the PR description. If existing TODOs are found in files being modified, they should be addressed as part of the changes.
- **Use DI for services.** Never directly instantiate services or repositories. Always use the Modular DI system to ensure proper lifecycle management and testability.
- **Follow design system tokens.** All UI must use design system tokens for colors, typography, spacing, and icons. No hardcoded values. This ensures visual consistency and easier theming in the future.
- **Think Before Coding** 
  - Don't assume. Don't hide confusion. Surface tradeoffs.
    ```
     State assumptions explicitly — If uncertain, ask rather than guess
     Present multiple interpretations — Don't pick silently when ambiguity exists
     Push back when warranted — If a simpler approach exists, say so
     Stop when confused — Name what's unclear and ask for clarification
    ```
- **Goal-Driven Execution**
  - Define success criteria. Loop until verified. Transform imperative tasks into verifiable goals.
  - For multi-step tasks, state a brief plan:
    ```
    1. [Step] → verify: [check]
    2. [Step] → verify: [check]
    3. [Step] → verify: [check]
    ```
   Strong success criteria let the LLM loop independently. Weak criteria ("make it work") require constant clarification.
