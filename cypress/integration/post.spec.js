describe('POST /characters', () => {
    before(() => {
        cy.back2ThePast();
        cy.setToken();
    });

    it('Deve cadastrar um personagem com sucesso', () => {
        const character = {
            name: 'Charles Xavier',
            alias: 'Professor X',
            team: ['x-men', 'Illuminati'],
            active: true,
        };

        cy.postCharacter(character)
            .then((response) => {
                expect(response.status).to.eql(201);
                expect(response.body.character_id.length).to.equal(24);
            });
    });

    context('Quando o personagem já existe', () => {
        const character = {
            name: 'Logan',
            alias: 'Wolverine',
            team: ['x-men'],
            active: true,
        };

        before(() => {
            cy.postCharacter(character)
                .then((response) => {
                    expect(response.status).to.eql(201);
                });
        });

        it('Não deve cadastrar duplicado', () => {
            cy.postCharacter(character)
                .then((response) => {
                    expect(response.status).to.eql(400);
                    expect(response.body.error).to.eql('Duplicate character');
                });
        });
    });

    context('Validar os campos obrigatórios para o cadastro do personagem', () => {
        it('Validar a obrigatoriedade do nome', () => {
            const character = {
                alias: 'Wolverine',
                team: ['x-men'],
                active: true,
            };

            cy.postCharacter(character)
                .then((response) => {
                    expect(response.status).to.eql(400);
                    expect(response.body.validation.body.message).to.eql('\"name\" is required');
                });
        });

        it('Validar a obrigatoriedade do alias', () => {
            const character = {
                name: 'Logan',
                team: ['x-men'],
                active: true,
            };

            cy.postCharacter(character)
                .then((response) => {
                    expect(response.status).to.eql(400);
                    expect(response.body.validation.body.message).to.eql('\"alias\" is required');
                });
        });

        it('Validar a obrigatoriedade do team', () => {
            const character = {
                name: 'Logan',
                alias: 'Wolverine',
                active: true,
            };

            cy.postCharacter(character)
                .then((response) => {
                    expect(response.status).to.eql(400);
                    expect(response.body.validation.body.message).to.eql('\"team\" is required');
                });
        });

        it('Validar a obrigatoriedade do active', () => {
            const character = {
                name: 'Logan',
                alias: 'Wolverine',
                team: ['x-men'],
            };

            cy.postCharacter(character)
                .then((response) => {
                    expect(response.status).to.eql(400);
                    expect(response.body.validation.body.message).to.eql('\"active\" is required');
                });
        });
    });
});
