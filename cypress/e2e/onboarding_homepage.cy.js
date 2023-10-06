/// <reference types="cypress" />
context("Fluxos de entrada Homepage", () => {
  beforeEach(() => {
    cy.visit("https://appdev.aprendizap.com.br", {
      onBeforeLoad(win) {
        delete win.navigator.__proto__.ServiceWorker;
        delete win.navigator.serviceWorker;
      },
    });
    if (window.navigator && navigator.serviceWorker) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister();
        });
      });
    }
  });

  afterEach(() => {
    if (window.navigator && navigator.serviceWorker) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister();
        });
      });
    }
  });

  context(
    "Dado que estou na homepage e não preenchi nenhum step de onboarding",
    () => {
      describe("Quando preencho os campos de telefone com um número válido e o campo de senha", () => {
        beforeEach(() => {
          cy.contains("button", "Entrar").should("be.disabled");
          cy.get("#phone").type("12345678910");
          cy.get("#password").type("12345678");
        });
        it("Então devo ver o botão de entrar habilitado", () => {
          cy.contains("button", "Entrar").should("not.be.disabled");
        });

        it("Então devo seguir para o onboarding completo de 3 etapas", () => {
          cy.contains("button", "Entrar").click();

          cy.contains(
            "p",
            "Selecione disciplinas e áreas para acessar seus conteúdos."
          );
          cy.contains("Disciplinas e áreas");
          cy.contains("Alunos");

          cy.contains("Ensino Fundamental:");
          cy.contains("Ensino Médio:");
          cy.contains("button", "Continuar")
            .should("be.visible")
            .should("be.disabled");
        });
      });
    }
  );
});
