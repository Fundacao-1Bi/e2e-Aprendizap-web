/// <reference types="cypress" />

context("Dado que não preenchi nenhum step de onboarding", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });
  describe("Quando acesso a homepage do aplicativo vindo de landing page", () => {
    it("Então devo visualizar a primeira tela de onboarding contendo alguns benefícios do AprendiZAP em carrossel (O carrossel não passa sozinho) e a opção de Criar conta, Acesso rápido e Entrar e reportar paginaOnboarding?utm_origin=landingpage", () => {
      cy.intercept("PUT", "**/develop/teachers/unregistered/**").as(
        "reportData"
      );
      cy.visit("https://appdev.aprendizap.com.br/?utm_origin=landingpage");

      let firstRequestWasCreatedAt = true;
      cy.wait("@reportData").should(({ request, response }) => {
        if (request.body.save.key === "createdAt") {
          expect(request.body).to.have.property("save");
          expect(request.body.save).to.have.property("key");
          expect(request.body.save.key).to.equal("createdAt");
          expect(request.headers).to.have.property("content-type");
          expect(response && response.body).to.have.property("error", false);
        } else {
          expect(request.body).to.deep.equal({
            save: {
              key: "status",
              value: "paginaOnboarding?utm_origin=landingpage",
            },
          });
          expect(request.headers).to.have.property("content-type");
          expect(response && response.body).to.have.property("error", false);
          firstRequestWasCreatedAt = false;
        }
      });

      // Report de origem de acesso
      cy.wait("@reportData").should(({ request, response }) => {
        if (firstRequestWasCreatedAt) {
          expect(request.body).to.deep.equal({
            save: {
              key: "status",
              value: "paginaOnboarding?utm_origin=landingpage",
            },
          });
          expect(request.headers).to.have.property("content-type");
          expect(response && response.body).to.have.property("error", false);
        } else {
          expect(request.body).to.have.property("save");
          expect(request.body.save).to.have.property("key");
          expect(request.body.save.key).to.equal("createdAt");
          expect(request.headers).to.have.property("content-type");
          expect(response && response.body).to.have.property("error", false);
        }
      });

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
        "https://appdev.aprendizap.com.br/?utm_origin=SEO&SEOID=42424242-65fe-400d-8511-b87f78424242"
      );

      let firstRequestWasCreatedAt = true;
      cy.wait("@reportData").should(({ request, response }) => {
        if (request.body.save.key === "createdAt") {
          expect(request.body).to.have.property("save");
          expect(request.body.save).to.have.property("key");
          expect(request.body.save.key).to.equal("createdAt");
          expect(request.headers).to.have.property("content-type");
          expect(response && response.body).to.have.property("error", false);
        } else {
          expect(request.body).to.deep.equal({
            save: {
              key: "status",
              value:
                "paginaOnboarding?utm_origin=SEO&SEOID=42424242-65fe-400d-8511-b87f78424242",
            },
          });
          expect(request.headers).to.have.property("content-type");
          expect(response && response.body).to.have.property("error", false);
          firstRequestWasCreatedAt = false;
        }
      });

      // Report de origem de acesso
      cy.wait("@reportData").should(({ request, response }) => {
        if (firstRequestWasCreatedAt) {
          expect(request.body).to.deep.equal({
            save: {
              key: "status",
              value:
                "paginaOnboarding?utm_origin=SEO&SEOID=42424242-65fe-400d-8511-b87f78424242",
            },
          });
          expect(request.headers).to.have.property("content-type");
          expect(response && response.body).to.have.property("error", false);
        } else {
          expect(request.body).to.have.property("save");
          expect(request.body.save).to.have.property("key");
          expect(request.body.save.key).to.equal("createdAt");
          expect(request.headers).to.have.property("content-type");
          expect(response && response.body).to.have.property("error", false);
        }
      });
    });
  });
});
