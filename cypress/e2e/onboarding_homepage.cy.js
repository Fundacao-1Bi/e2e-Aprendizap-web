/// <reference types="cypress" />
context("Fluxos de entrada Homepage", () => {
  beforeEach(async () => {
    cy.visit("https://appdev.aprendizap.com.br", {
      onBeforeLoad(win) {
        delete win.navigator.__proto__.ServiceWorker;
      },
    });
  });

  context(
    "Dado que estou na homepage e não preenchi nenhum step de onboarding",
    () => {
      describe("Quando clico em acesso rápido", () => {
        it("Então devo seguir para o onboarding completo de 3 etapas", () => {
          cy.contains("button", "Acesso rápido").click();
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
          cy.contains("button", "Voltar")
            .should("be.visible")
            .should("not.be.disabled");
        });
      });
    }
  );

  context("Dado que estou na homepage e cliquei em acesso rápido", () => {
    beforeEach(() => {
      cy.contains("button", "Acesso rápido").click();
    });
    describe("Quando clico em voltar", () => {
      it("Então devo retornar para a homepage", () => {
        cy.contains("button", "Voltar").click();
        cy.contains("button", "Acesso rápido");
      });
    });

    describe("Quando seleciono uma disciplina", () => {
      it("Então devo ver a disciplina selecionada e o botão de Continuar habilitado", () => {
        cy.contains("button", "Continuar").should("be.disabled");
        cy.contains("button", "Voltar").should("not.be.disabled");

        cy.get('[data-testid="checkbox-fundii-5"]').click();
        cy.contains("button", "Continuar").should("not.be.disabled");
        cy.contains("button", "Voltar").should("not.be.disabled");
        cy.get('[data-testid="checkbox-fundii-5"] > input').should(
          "be.checked"
        );
      });

      describe("Quando clico em continuar", () => {
        it("Então devo seguir para a segunda etapa do onboarding", () => {
          cy.get('[data-testid="checkbox-fundii-5"]').click();
          cy.contains("button", "Continuar").click();
          cy.contains("Com quantos alunos você pretende usar o AprendiZAP?");
          cy.contains("button", "Continuar").should("be.disabled");
          cy.contains("button", "Voltar").should("not.be.disabled");
        });
      });
    });
  });

  context("Dado que estou no segundo step do onboarding", () => {
    beforeEach(() => {
      cy.contains("button", "Acesso rápido").click();
      cy.get('[data-testid="checkbox-fundii-5"]').click();
      cy.contains("button", "Continuar").click();
      cy.contains("Com quantos alunos você pretende usar o AprendiZAP?");
      cy.contains(
        "Selecione disciplinas e áreas para acessar seus conteúdos."
      ).should("not.exist");
    });
    describe("Quando clico em voltar", () => {
      it("Então devo retornar para a homepage", () => {
        cy.contains("button", "Voltar").click();
        cy.contains(
          "Selecione disciplinas e áreas para acessar seus conteúdos."
        ).should("exist");
      });
    });

    describe("Quando digito uma quantidade de alunos maior que zero", () => {
      beforeEach(() => {
        cy.contains("button", "Continuar").should("be.disabled");
        cy.get("#studentsQuantity").type("30");
      });
      it("Então devo ver o botão de continuar habilitado", () => {
        cy.contains("button", "Continuar").should("not.be.disabled");
      });

      describe("Quando clico em continuar", () => {
        it("Então devo seguir para a terceira etapa do onboarding", () => {
          cy.contains("button", "Continuar").click();
          cy.contains("Recomendações 100% gratuitas!");
          cy.contains("button", "Acessar conteúdos").should("be.disabled");
        });
      });
    });

    describe("Quando digito uma quantidade de alunos igual a zero", () => {
      beforeEach(() => {
        cy.contains("button", "Continuar").should("be.disabled");
        cy.get("#studentsQuantity").type("0");
      });
      it("Então devo ver o botão de continuar habilitado", () => {
        cy.contains("button", "Continuar").should("not.be.disabled");
      });
      describe("Quando clico em continuar", () => {
        it("Então devo seguir para a terceira etapa do onboarding", () => {
          cy.contains("button", "Continuar").click();
          cy.contains("Recomendações 100% gratuitas!");
          cy.contains("button", "Acessar conteúdos").should("be.disabled");
        });
      });
    });
  });

  context("Dado que estou no terceiro step do onboarding", () => {
    beforeEach(() => {
      cy.contains("button", "Acesso rápido").click();
      cy.get('[data-testid="checkbox-fundii-5"]').click();
      cy.contains("button", "Continuar").click();
      cy.contains("Com quantos alunos você pretende usar o AprendiZAP?");
      cy.get("#studentsQuantity").type("30");
      cy.contains("button", "Continuar").click();
      cy.contains("Recomendações 100% gratuitas!");
    });

    it("Então devo ver o modal de recomendação já com a opção de Quero recomendações selecionada", () => {
      cy.contains("button", "Acessar conteúdos").should("be.disabled");
      cy.get("label:nth-child(1) > span > input").should("be.checked");
      cy.get("label:nth-child(2) > span > input").should("not.be.checked");
    });

    describe("Quando Digito meu telefone", () => {
      beforeEach(() => {
        cy.get("#phone").type("11999999999");
      });
      it("Então devo ver o botão de Acessar conteúdos habilitado", () => {
        cy.contains("button", "Acessar conteúdos").should("not.be.disabled");
      });
      describe("Quando clico em Acessar conteúdos", () => {
        it("Então devo seguir para a homepage com a lista de aulas", () => {
          cy.contains("button", "Acessar conteúdos").click();
          cy.contains("Você pode gostar");
          cy.contains("Selecionar disciplina(s)");
        });
      });
    });

    describe("Quando clico em Prefiro não informar meu número agora", () => {
      beforeEach(() => {
        cy.contains("Prefiro não informar meu celular agora").click();
      });
      it("Então devo ver o botão de Acessar conteúdos habilitado", () => {
        cy.contains("button", "Acessar conteúdos").should("not.be.disabled");
      });
      describe("Quando clico em Acessar conteúdos", () => {
        it("Então devo seguir para a homepage com a lista de aulas", () => {
          cy.contains("button", "Acessar conteúdos").click();
          cy.contains("Você pode gostar");
          cy.contains("Selecionar disciplina(s)");
        });
      });
    });
  });
});
