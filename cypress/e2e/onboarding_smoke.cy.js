/// <reference types="cypress" />

context("Dado que não preenchi nenhum step de onboarding", () => {
  beforeEach(async () => {
    cy.clearLocalStorage();
    if (window.navigator && navigator.serviceWorker) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister();
        });
      });
    }
  });
  describe("Quando acesso a homepage do aplicativo vindo de landing page", () => {
    it("Então devo visualizar a primeira tela de onboarding contendo alguns benefícios do AprendiZAP em carrossel (O carrossel não passa sozinho) e a opção de Criar conta, Acesso rápido e Entrar e reportar paginaOnboarding?utm_origin=landingpage", () => {
      cy.intercept("PUT", "**/develop/teachers/unregistered/**").as(
        "reportData"
      );
      cy.visit("https://appdev.aprendizap.com.br/?utm_origin=landingpage", {
        onBeforeLoad(win) {
          delete win.navigator.__proto__.ServiceWorker;
          delete win.navigator.serviceWorker;
        },
      });

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

      cy.contains("h2", "Conteúdos e exercícios gratuitos").should(
        "be.visible"
      );
      cy.contains("h2", "para aulas incríveis!").should("be.visible");
      cy.contains(
        "p",
        "Acesse + de 2000 conteúdos prontos para inspiração e construção de melhores experiências de aprendizagem."
      ).should("be.visible");
      cy.contains("button", "Criar conta").should("be.visible");
      cy.contains("button", "Acesso rápido").should("be.visible");
      cy.contains("button", "Entrar").should("be.visible");
    });
  });

  describe("Quando acesso a homepage do aplicativo vindo de SEO", () => {
    it("Então devo visualizar a primeira tela de onboarding contendo alguns benefícios do AprendiZAP em carrossel (O carrossel não passa sozinho) e a opção de Criar conta, Acesso rápido e Entrar e reportar paginaOnboarding?utm_origin=SEO", () => {
      cy.intercept("PUT", "**/develop/teachers/unregistered/**").as(
        "reportData"
      );

      cy.visit(
        "https://appdev.aprendizap.com.br/?utm_origin=SEO&SEOID=42424242-65fe-400d-8511-b87f78424242",
        {
          onBeforeLoad(win) {
            delete win.navigator.__proto__.ServiceWorker;
            delete win.navigator.serviceWorker;
          },
        }
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
      }
    });
  });
});
