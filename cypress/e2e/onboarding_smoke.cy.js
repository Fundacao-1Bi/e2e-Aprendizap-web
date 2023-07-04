/// <reference types="cypress" />

context("Dado que não preenchi nenhum step de onboarding", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });
  describe("Quando acesso a homepage do aplicativo vindo de landing page", () => {
    it("Então devo visualizar a segunda tela do onboarding, com as opções de matérias que posso selecionar e reportar paginaOnboarding?utm_origin=landingpage", () => {
      cy.intercept("PUT", "**/develop/teachers/unregistered/**").as(
        "reportData"
      );
      cy.visit("https://appdev.aprendizap.com.br/?utm_origin=landingpage");

      let createdAtCalled = false;
      let statusCalled = false;
      const numberOfRequests = 2;

      for (let i = 0; i < numberOfRequests; i++) {
        cy.wait("@reportData").should(({ request, response }) => {
          expect(request.body).to.have.property("save");
          expect(request.body.save).to.have.property("key");
          expect(response && response.body).to.have.property("error", false);
          switch (request.body.save.key) {
            case "createdAt":
              expect(request.body.save.key).to.equal("createdAt");

              createdAtCalled = true;
              break;

            case "status":
              expect(request.body).to.deep.equal({
                save: {
                  key: "status",
                  value: "paginaOnboarding?utm_origin=landingpage",
                },
              });
              statusCalled = true;
              break;
          }
          if (i === numberOfRequests - 1) {
            expect(createdAtCalled).to.be.true;
            expect(statusCalled).to.be.true;
          }
        });
      }

      cy.contains(
        "p",
        "Selecione disciplinas e áreas para acessar seus conteúdos."
      ).should("be.visible");
      cy.contains("legend", "Ensino Fundamental:").should("be.visible");
      cy.contains("legend", "Ensino Médio:").should("be.visible");
      cy.contains("button", "Continuar").should("be.visible");
      cy.contains("button", "Voltar").should("be.visible");
    });
  });

  describe("Quando acesso a homepage do aplicativo vindo de SEO", () => {
    it("Então devo visualizar a segunda tela do onboarding, com as opções de matérias que posso selecionar e reportar paginaOnboarding?utm_origin=SEO e o SEO_ID", () => {
      cy.intercept("PUT", "**/develop/teachers/unregistered/**").as(
        "reportData"
      );
      cy.visit(
        "https://appdev.aprendizap.com.br/?utm_origin=SEO&SEOID=42424242-65fe-400d-8511-b87f78424242"
      );

      let createdAtCalled = false;
      let statusCalled = false;
      let seoIDCalled = false;

      const numberOfRequests = 3;

      for (let i = 0; i < numberOfRequests; i++) {
        cy.wait("@reportData").should(({ request, response }) => {
          expect(request.body).to.have.property("save");
          expect(request.body.save).to.have.property("key");
          expect(response && response.body).to.have.property("error", false);
          switch (request.body.save.key) {
            case "createdAt":
              expect(request.body.save.key).to.equal("createdAt");

              createdAtCalled = true;
              break;

            case "status":
              expect(request.body).to.deep.equal({
                save: {
                  key: "status",
                  value:
                    "paginaOnboarding?utm_origin=SEO&SEOID=42424242-65fe-400d-8511-b87f78424242",
                },
              });
              statusCalled = true;
              break;

            case "SEO_ID":
              expect(request.body).to.deep.equal({
                save: {
                  key: "SEO_ID",
                  value: "42424242-65fe-400d-8511-b87f78424242",
                },
              });
              seoIDCalled = true;
              break;
          }
          if (i === numberOfRequests - 1) {
            expect(createdAtCalled).to.be.true;
            expect(statusCalled).to.be.true;
            expect(seoIDCalled).to.be.true;
          }
        });
        cy.contains(
          "p",
          "Selecione disciplinas e áreas para acessar seus conteúdos."
        ).should("be.visible");
        cy.contains("legend", "Ensino Fundamental:").should("be.visible");
        cy.contains("legend", "Ensino Médio:").should("be.visible");
        cy.contains("button", "Continuar").should("be.visible");
        cy.contains("button", "Voltar").should("be.visible");
      }
    });
  });
});
