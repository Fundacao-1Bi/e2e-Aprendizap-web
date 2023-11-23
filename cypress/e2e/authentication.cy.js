const userName = "Quarenta";
const userLoginOnly = "42424242424";
const password = "42424242";

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

  context("Dado que estou na homepage", () => {
    describe("Quando preencho os campos de telefone com um número e senha válidas", () => {
      beforeEach(() => {
        cy.contains("button", "Entrar").should("be.disabled");
        cy.get("#phone").type(userLoginOnly);
        cy.get("#password").type("42424242");
      });
      it("Então devo ver o botão de entrar habilitado", () => {
        cy.contains("button", "Entrar").should("not.be.disabled");
      });
      describe("Quando clico no botão de entrar", () => {
        it("Então devo logar com sucesso na aplicação e visualizar as matérias selecionadas para esta conta", () => {
          cy.contains("button", "Entrar").click();
          cy.contains("Português");
          cy.contains("Geografia");
          cy.contains(userName);
          cy.contains("Selecionar disciplina(s)");
        });
      });
    });
  });
});
