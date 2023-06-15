export const schema = {
    "models": {
        "Game": {
            "name": "Game",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "PlayerX": {
                    "name": "PlayerX",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "PlayerO": {
                    "name": "PlayerO",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "Board": {
                    "name": "Board",
                    "isArray": true,
                    "type": "String",
                    "isRequired": true,
                    "attributes": [],
                    "isArrayNullable": true
                },
                "CurrentPlayer": {
                    "name": "CurrentPlayer",
                    "isArray": false,
                    "type": {
                        "enum": "Player"
                    },
                    "isRequired": true,
                    "attributes": []
                },
                "isWinner": {
                    "name": "isWinner",
                    "isArray": false,
                    "type": {
                        "enum": "Player"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "Games",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "public",
                                "operations": [
                                    "create",
                                    "update",
                                    "delete",
                                    "read"
                                ]
                            }
                        ]
                    }
                }
            ]
        }
    },
    "enums": {
        "Player": {
            "name": "Player",
            "values": [
                "X",
                "O"
            ]
        }
    },
    "nonModels": {},
    "codegenVersion": "3.4.3",
    "version": "17517c676bf0f7b450163ccbc0c1b142"
};