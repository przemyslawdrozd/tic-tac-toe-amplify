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
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "PlayerO": {
                    "name": "PlayerO",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "Board": {
                    "name": "Board",
                    "isArray": true,
                    "type": "String",
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true
                },
                "IsWinner": {
                    "name": "IsWinner",
                    "isArray": false,
                    "type": {
                        "enum": "Player"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "CurrentPlayer": {
                    "name": "CurrentPlayer",
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
    "codegenVersion": "3.4.4",
    "version": "4ea52d37c471a13c3434b5a073a6bfb8"
};