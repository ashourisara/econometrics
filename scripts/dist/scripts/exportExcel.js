#!/usr/bin/env node
"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create(
        (typeof Iterator === "function" ? Iterator : Object).prototype
      );
    return (
      (g.next = verb(0)),
      (g["throw"] = verb(1)),
      (g["return"] = verb(2)),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("../src/lib/db");
var exceljs_1 = require("exceljs");
var path_1 = require("path");
var fs_1 = require("fs");
function exportToExcel() {
  return __awaiter(this, void 0, void 0, function () {
    var data, workbook, worksheet_1, exportDir, exportPath, error_1;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 2, , 3]);
          data = db_1.default
            .prepare(
              "\n      SELECT \n        id,\n        title,\n        volume,\n        value,\n        buy,\n        sell,\n        ratio,\n        transfer,\n        datetime(created_at, 'localtime') as created_at\n      FROM fixed_income\n      ORDER BY created_at DESC\n    "
            )
            .all();
          if (data.length === 0) {
            console.log("No data found in database");
            return [2 /*return*/];
          }
          workbook = new exceljs_1.default.Workbook();
          worksheet_1 = workbook.addWorksheet("Fixed Income Data");
          // Add headers
          worksheet_1.columns = [
            { header: "Title", key: "title", width: 20 },
            { header: "Volume", key: "volume", width: 15 },
            { header: "Value", key: "value", width: 15 },
            { header: "Buy", key: "buy", width: 15 },
            { header: "Sell", key: "sell", width: 15 },
            { header: "Ratio", key: "ratio", width: 15 },
            { header: "Transfer", key: "transfer", width: 15 },
            { header: "Date", key: "created_at", width: 20 },
          ];
          // Add data rows
          data.forEach(function (item) {
            worksheet_1.addRow({
              title: item.title,
              volume: item.volume,
              value: item.value,
              buy: item.buy,
              sell: item.sell,
              ratio: item.ratio,
              transfer: item.transfer,
              created_at: item.created_at,
            });
          });
          exportDir = path_1.default.join(process.cwd(), "exports");
          if (!fs_1.default.existsSync(exportDir)) {
            fs_1.default.mkdirSync(exportDir, { recursive: true });
          }
          exportPath = path_1.default.join(
            exportDir,
            "fixed_income_export.xlsx"
          );
          return [4 /*yield*/, workbook.xlsx.writeFile(exportPath)];
        case 1:
          _a.sent();
          console.log(
            "\u2705 Successfully exported "
              .concat(data.length, " records to ")
              .concat(exportPath)
          );
          return [3 /*break*/, 3];
        case 2:
          error_1 = _a.sent();
          console.error("❌ Export failed:", error_1);
          process.exit(1);
          return [3 /*break*/, 3];
        case 3:
          return [2 /*return*/];
      }
    });
  });
}
exportToExcel();
