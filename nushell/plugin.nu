register /home/rwarner/Development/nu_plugin_from_parquet/target/release/nu_plugin_from_parquet  {
  "sig": {
    "name": "from parquet",
    "usage": "Convert from .parquet binary into table",
    "extra_usage": "",
    "search_terms": [],
    "required_positional": [],
    "optional_positional": [],
    "rest_positional": null,
    "vectorizes_over_list": false,
    "named": [
      {
        "long": "help",
        "short": "h",
        "arg": null,
        "required": false,
        "desc": "Display the help message for this command",
        "var_id": null,
        "default_value": null
      },
      {
        "long": "metadata",
        "short": "m",
        "arg": null,
        "required": false,
        "desc": "Convert metadata from .parquet binary into table",
        "var_id": null,
        "default_value": null
      }
    ],
    "input_type": "Any",
    "output_type": "Any",
    "input_output_types": [
      [
        "Binary",
        "Any"
      ]
    ],
    "allow_variants_without_examples": true,
    "is_filter": true,
    "creates_scope": false,
    "allows_unknown_args": false,
    "category": "Experimental"
  },
  "examples": [
    {
      "example": "open --raw file.parquet | from parquet",
      "description": "Convert from .parquet binary into table",
      "result": null
    },
    {
      "example": "open file.parquet",
      "description": "Convert from .parquet binary into table",
      "result": null
    },
    {
      "example": "open file.parquet | from parquet --metadata",
      "description": "Convert metadata from .parquet binary into table",
      "result": null
    }
  ]
}

