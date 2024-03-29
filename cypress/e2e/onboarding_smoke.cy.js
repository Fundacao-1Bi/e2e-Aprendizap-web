/// <reference types="cypress" />

context("Dado que não preenchi nenhum step de onboarding", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
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
  describe("Quando acesso a homepage do aplicativo vindo de landing page", () => {
    it("Então devo visualizar a primeira tela de onboarding contendo alguns benefícios do AprendiZAP em carrossel (O carrossel não passa sozinho) e a opção de Entrar, Entrar com Google, Entrar com Facebook e Criar conta e reportar paginaOnboarding?utm_origin=landingpage", () => {
      cy.intercept("PUT", "**/teachers/unregistered/**").as("reportData");
      cy.visit("https://appdev.aprendizap.com.br/?utm_origin=landingpage", {
        onBeforeLoad(win) {
          delete win.navigator.__proto__.ServiceWorker;
          delete win.navigator.serviceWorker;
        },
      });

      let createdAtCalled = false;
      let statuspaginaOnboardingCalled = false;
      let statusOpeningCalled = false;
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
              if (
                request.body.save.value ===
                "OPENING?autenticacao=entrar&utm_source=/"
              ) {
                expect(request.body).to.deep.equal({
                  save: {
                    key: "status",
                    value: "OPENING?autenticacao=entrar&utm_source=/",
                  },
                });
                statusOpeningCalled = true;
              } else {
                expect(request.body).to.deep.equal({
                  save: {
                    key: "status",
                    value: "paginaOnboarding?utm_origin=landingpage",
                  },
                });
                statuspaginaOnboardingCalled = true;
              }
              break;
          }
          if (i === numberOfRequests - 1) {
            expect(createdAtCalled).to.be.true;
            expect(statusOpeningCalled).to.be.true;
            expect(statuspaginaOnboardingCalled).to.be.true;
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
      cy.contains("button", "Entrar").should("be.visible");
      cy.contains("button", "Entrar com Google").should("be.visible");
      cy.contains("button", "Entrar com Facebook").should("be.visible");
      cy.contains("button", "Criar conta").should("be.visible");
    });
  });

  describe("Quando acesso a homepage do aplicativo vindo de SEO", () => {
    it("Então devo visualizar a primeira tela de onboarding contendo alguns benefícios do AprendiZAP em carrossel (O carrossel não passa sozinho) e a opção de Entrar, Entrar com Google, Entrar com Facebook e Criar conta e reportar paginaOnboarding?utm_origin=SEO", () => {
      cy.intercept("PUT", "**/teachers/unregistered/**").as("reportData");

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
      let statusOnboardingCalled = false;
      let seoIDCalled = false;
      let statusOpeningCalled = false;
      const numberOfRequests = 4;

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
              if (
                request.body.save.value ===
                "OPENING?autenticacao=entrar&utm_source=/"
              ) {
                expect(request.body).to.deep.equal({
                  save: {
                    key: "status",
                    value: "OPENING?autenticacao=entrar&utm_source=/",
                  },
                });
                statusOpeningCalled = true;
              } else {
                expect(request.body).to.deep.equal({
                  save: {
                    key: "status",
                    value:
                      "paginaOnboarding?utm_origin=SEO&SEOID=42424242-65fe-400d-8511-b87f78424242",
                  },
                });
                statusOnboardingCalled = true;
              }
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
            expect(statusOnboardingCalled).to.be.true;
            expect(statusOpeningCalled).to.be.true;
            expect(seoIDCalled).to.be.true;
          }
        });
      }
    });
  });
});
