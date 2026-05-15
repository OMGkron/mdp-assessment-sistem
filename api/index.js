"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc2) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc2 = __getOwnPropDesc(from, key)) || desc2.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// shared/const.ts
var const_exports = {};
__export(const_exports, {
  AXIOS_TIMEOUT_MS: () => AXIOS_TIMEOUT_MS,
  COOKIE_NAME: () => COOKIE_NAME,
  NOT_ADMIN_ERR_MSG: () => NOT_ADMIN_ERR_MSG,
  ONE_YEAR_MS: () => ONE_YEAR_MS,
  UNAUTHED_ERR_MSG: () => UNAUTHED_ERR_MSG
});
var COOKIE_NAME, ONE_YEAR_MS, AXIOS_TIMEOUT_MS, UNAUTHED_ERR_MSG, NOT_ADMIN_ERR_MSG;
var init_const = __esm({
  "shared/const.ts"() {
    "use strict";
    COOKIE_NAME = "app_session_id";
    ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
    AXIOS_TIMEOUT_MS = 3e4;
    UNAUTHED_ERR_MSG = "Please login (10001)";
    NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";
  }
});

// drizzle/schema.ts
var import_pg_core, roleEnum, assessmentTypeEnum, statusEnum, users, participants, assessments, competencyScores, sbiFeedback;
var init_schema = __esm({
  "drizzle/schema.ts"() {
    "use strict";
    import_pg_core = require("drizzle-orm/pg-core");
    roleEnum = (0, import_pg_core.pgEnum)("role", ["user", "admin"]);
    assessmentTypeEnum = (0, import_pg_core.pgEnum)("assessment_type", ["self", "observation"]);
    statusEnum = (0, import_pg_core.pgEnum)("status", ["draft", "completed"]);
    users = (0, import_pg_core.pgTable)("users", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      openId: (0, import_pg_core.varchar)("openId", { length: 64 }).notNull().unique(),
      name: (0, import_pg_core.text)("name"),
      email: (0, import_pg_core.varchar)("email", { length: 320 }),
      loginMethod: (0, import_pg_core.varchar)("loginMethod", { length: 64 }),
      role: roleEnum("role").default("user").notNull(),
      createdAt: (0, import_pg_core.timestamp)("createdAt").defaultNow().notNull(),
      updatedAt: (0, import_pg_core.timestamp)("updatedAt").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date()).notNull(),
      lastSignedIn: (0, import_pg_core.timestamp)("lastSignedIn").defaultNow().notNull()
    });
    participants = (0, import_pg_core.pgTable)("participants", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      participantCode: (0, import_pg_core.varchar)("participantCode", { length: 16 }).notNull().unique(),
      fullName: (0, import_pg_core.varchar)("fullName", { length: 128 }).notNull(),
      department: (0, import_pg_core.varchar)("department", { length: 64 }).notNull(),
      position: (0, import_pg_core.varchar)("position", { length: 64 }).notNull(),
      mentorName: (0, import_pg_core.varchar)("mentorName", { length: 128 }),
      email: (0, import_pg_core.varchar)("email", { length: 320 }),
      joinDate: (0, import_pg_core.varchar)("joinDate", { length: 32 }),
      isActive: (0, import_pg_core.boolean)("isActive").default(true).notNull(),
      createdAt: (0, import_pg_core.timestamp)("createdAt").defaultNow().notNull(),
      updatedAt: (0, import_pg_core.timestamp)("updatedAt").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
    });
    assessments = (0, import_pg_core.pgTable)("assessments", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      participantId: (0, import_pg_core.integer)("participantId").notNull(),
      assessmentType: assessmentTypeEnum("assessmentType").notNull(),
      assessorName: (0, import_pg_core.varchar)("assessorName", { length: 128 }),
      // null = self
      assessorRole: (0, import_pg_core.varchar)("assessorRole", { length: 64 }),
      // Mentor, Coach, etc.
      period: (0, import_pg_core.varchar)("period", { length: 32 }).notNull().default("2026"),
      // e.g. "2026-Q1"
      status: statusEnum("status").default("draft").notNull(),
      notes: (0, import_pg_core.text)("notes"),
      createdAt: (0, import_pg_core.timestamp)("createdAt").defaultNow().notNull(),
      updatedAt: (0, import_pg_core.timestamp)("updatedAt").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
    });
    competencyScores = (0, import_pg_core.pgTable)("competency_scores", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      assessmentId: (0, import_pg_core.integer)("assessmentId").notNull(),
      competencyKey: (0, import_pg_core.varchar)("competencyKey", { length: 64 }).notNull(),
      // e.g. "strategic_thinking", "leadership", "communication", etc.
      score: (0, import_pg_core.integer)("score").notNull(),
      // 1-5
      behavioralEvidence: (0, import_pg_core.text)("behavioralEvidence"),
      // SBI notes
      createdAt: (0, import_pg_core.timestamp)("createdAt").defaultNow().notNull()
    });
    sbiFeedback = (0, import_pg_core.pgTable)("sbi_feedback", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      assessmentId: (0, import_pg_core.integer)("assessmentId").notNull(),
      competencyKey: (0, import_pg_core.varchar)("competencyKey", { length: 64 }).notNull(),
      situation: (0, import_pg_core.text)("situation"),
      behavior: (0, import_pg_core.text)("behavior"),
      impact: (0, import_pg_core.text)("impact"),
      actionPlan: (0, import_pg_core.text)("actionPlan"),
      createdAt: (0, import_pg_core.timestamp)("createdAt").defaultNow().notNull()
    });
  }
});

// server/_core/env.ts
var ENV;
var init_env = __esm({
  "server/_core/env.ts"() {
    "use strict";
    ENV = {
      appId: process.env.VITE_APP_ID ?? "",
      cookieSecret: process.env.JWT_SECRET ?? "",
      databaseUrl: process.env.DATABASE_URL ?? "",
      oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
      ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
      isProduction: process.env.NODE_ENV === "production",
      forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
      forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
    };
  }
});

// server/db.ts
var db_exports = {};
__export(db_exports, {
  completeAssessment: () => completeAssessment,
  createAssessment: () => createAssessment,
  createParticipant: () => createParticipant,
  deleteParticipant: () => deleteParticipant,
  getAllAssessmentsWithScores: () => getAllAssessmentsWithScores,
  getAllParticipants: () => getAllParticipants,
  getAssessmentById: () => getAssessmentById,
  getAssessmentsByParticipant: () => getAssessmentsByParticipant,
  getDashboardSummary: () => getDashboardSummary,
  getDb: () => getDb,
  getParticipantById: () => getParticipantById,
  getParticipantResults: () => getParticipantResults,
  getSbiFeedbackByAssessment: () => getSbiFeedbackByAssessment,
  getScoresByAssessment: () => getScoresByAssessment,
  getUserByOpenId: () => getUserByOpenId,
  updateAssessmentNotes: () => updateAssessmentNotes,
  updateParticipant: () => updateParticipant,
  upsertAllScores: () => upsertAllScores,
  upsertCompetencyScore: () => upsertCompetencyScore,
  upsertSbiFeedback: () => upsertSbiFeedback,
  upsertUser: () => upsertUser
});
async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _client = (0, import_postgres.default)(process.env.DATABASE_URL);
      _db = (0, import_postgres_js.drizzle)(_client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function upsertUser(user) {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  try {
    const values = { openId: user.openId };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) values.lastSignedIn = /* @__PURE__ */ new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(users).where((0, import_drizzle_orm.eq)(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getAllParticipants() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(participants).orderBy(participants.participantCode);
}
async function getParticipantById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(participants).where((0, import_drizzle_orm.eq)(participants.id, id)).limit(1);
  return result[0];
}
async function createParticipant(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(participants).values({
    ...data,
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date()
  }).returning({ insertedId: participants.id });
  return result[0]?.insertedId ?? 0;
}
async function updateParticipant(id, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(participants).set({
    ...data,
    updatedAt: /* @__PURE__ */ new Date()
  }).where((0, import_drizzle_orm.eq)(participants.id, id));
}
async function deleteParticipant(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(participants).where((0, import_drizzle_orm.eq)(participants.id, id));
}
async function getAssessmentsByParticipant(participantId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(assessments).where((0, import_drizzle_orm.eq)(assessments.participantId, participantId)).orderBy((0, import_drizzle_orm.desc)(assessments.createdAt));
}
async function getAssessmentById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(assessments).where((0, import_drizzle_orm.eq)(assessments.id, id)).limit(1);
  return result[0];
}
async function createAssessment(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(assessments).values({
    participantId: data.participantId,
    assessmentType: data.assessmentType,
    assessorName: data.assessorName,
    assessorRole: data.assessorRole,
    period: data.period ?? "2026",
    notes: data.notes,
    status: "draft"
  }).returning({ insertedId: assessments.id });
  return result[0]?.insertedId ?? 0;
}
async function completeAssessment(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(assessments).set({ status: "completed" }).where((0, import_drizzle_orm.eq)(assessments.id, id));
}
async function updateAssessmentNotes(id, notes) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(assessments).set({ notes }).where((0, import_drizzle_orm.eq)(assessments.id, id));
}
async function getScoresByAssessment(assessmentId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(competencyScores).where((0, import_drizzle_orm.eq)(competencyScores.assessmentId, assessmentId));
}
async function upsertCompetencyScore(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(competencyScores).where(
    (0, import_drizzle_orm.and)(
      (0, import_drizzle_orm.eq)(competencyScores.assessmentId, data.assessmentId),
      (0, import_drizzle_orm.eq)(competencyScores.competencyKey, data.competencyKey)
    )
  );
  await db.insert(competencyScores).values({
    assessmentId: data.assessmentId,
    competencyKey: data.competencyKey,
    score: data.score,
    behavioralEvidence: data.behavioralEvidence
  });
}
async function upsertAllScores(assessmentId, scores) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(competencyScores).where((0, import_drizzle_orm.eq)(competencyScores.assessmentId, assessmentId));
  if (scores.length > 0) {
    await db.insert(competencyScores).values(
      scores.map((s) => ({
        assessmentId,
        competencyKey: s.competencyKey,
        score: s.score,
        behavioralEvidence: s.behavioralEvidence
      }))
    );
  }
}
async function getSbiFeedbackByAssessment(assessmentId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(sbiFeedback).where((0, import_drizzle_orm.eq)(sbiFeedback.assessmentId, assessmentId));
}
async function upsertSbiFeedback(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(sbiFeedback).where(
    (0, import_drizzle_orm.and)(
      (0, import_drizzle_orm.eq)(sbiFeedback.assessmentId, data.assessmentId),
      (0, import_drizzle_orm.eq)(sbiFeedback.competencyKey, data.competencyKey)
    )
  );
  await db.insert(sbiFeedback).values(data);
}
async function getParticipantResults(participantId) {
  const allAssessments = await getAssessmentsByParticipant(participantId);
  const selfAssessment = allAssessments.find(
    (a) => a.assessmentType === "self" && a.status === "completed"
  );
  const observationAssessment = allAssessments.find(
    (a) => a.assessmentType === "observation" && a.status === "completed"
  );
  const selfScores = selfAssessment ? await getScoresByAssessment(selfAssessment.id) : [];
  const observationScores = observationAssessment ? await getScoresByAssessment(observationAssessment.id) : [];
  return {
    selfAssessment,
    observationAssessment,
    selfScores,
    observationScores
  };
}
async function getDashboardSummary() {
  const allParticipants = await getAllParticipants();
  const db = await getDb();
  if (!db) return allParticipants.map((p) => ({ ...p, selfDone: false, observationDone: false, avgScore: null }));
  const allAssessments = await db.select().from(assessments).where((0, import_drizzle_orm.eq)(assessments.status, "completed"));
  return allParticipants.map((p) => {
    const pAssessments = allAssessments.filter((a) => a.participantId === p.id);
    const selfDone = pAssessments.some((a) => a.assessmentType === "self");
    const observationDone = pAssessments.some((a) => a.assessmentType === "observation");
    return { ...p, selfDone, observationDone };
  });
}
async function getAllAssessmentsWithScores() {
  const db = await getDb();
  if (!db) return [];
  const allParticipants = await getAllParticipants();
  const allAssessments = await db.select().from(assessments).orderBy(assessments.participantId);
  const allScores = await db.select().from(competencyScores);
  return allParticipants.map((p) => {
    const pAssessments = allAssessments.filter((a) => a.participantId === p.id);
    return {
      participant: p,
      assessments: pAssessments.map((a) => ({
        ...a,
        scores: allScores.filter((s) => s.assessmentId === a.id)
      }))
    };
  });
}
var import_drizzle_orm, import_postgres, import_postgres_js, _db, _client;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    import_drizzle_orm = require("drizzle-orm");
    import_postgres = __toESM(require("postgres"), 1);
    import_postgres_js = require("drizzle-orm/postgres-js");
    init_schema();
    init_env();
    _db = null;
    _client = null;
  }
});

// server/_core/cookies.ts
var cookies_exports = {};
__export(cookies_exports, {
  getSessionCookieOptions: () => getSessionCookieOptions
});
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  const secure = isSecureRequest(req);
  return {
    httpOnly: true,
    path: "/",
    sameSite: secure ? "none" : "lax",
    secure
  };
}
var init_cookies = __esm({
  "server/_core/cookies.ts"() {
    "use strict";
  }
});

// shared/_core/errors.ts
var HttpError, ForbiddenError;
var init_errors = __esm({
  "shared/_core/errors.ts"() {
    "use strict";
    HttpError = class extends Error {
      constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = "HttpError";
      }
    };
    ForbiddenError = (msg) => new HttpError(403, msg);
  }
});

// server/_core/sdk.ts
var sdk_exports = {};
__export(sdk_exports, {
  sdk: () => sdk
});
function buildCronUser(userInfo) {
  const now = /* @__PURE__ */ new Date();
  return {
    id: -1,
    openId: userInfo.openId,
    name: userInfo.name || "Manus Scheduled Task",
    email: null,
    loginMethod: null,
    role: "user",
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now,
    taskUid: userInfo.taskUid ?? void 0,
    isCron: true
  };
}
var import_axios, import_cookie, import_jose, isNonEmptyString, EXCHANGE_TOKEN_PATH, GET_USER_INFO_PATH, GET_USER_INFO_WITH_JWT_PATH, OAuthService, createOAuthHttpClient, SDKServer, CRON_OPEN_ID_PREFIX, sdk;
var init_sdk = __esm({
  "server/_core/sdk.ts"() {
    "use strict";
    init_const();
    init_errors();
    import_axios = __toESM(require("axios"), 1);
    import_cookie = require("cookie");
    import_jose = require("jose");
    init_db();
    init_env();
    isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
    EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
    GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
    GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
    OAuthService = class {
      constructor(client) {
        this.client = client;
        console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
        if (!ENV.oAuthServerUrl) {
          console.error(
            "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
          );
        }
      }
      decodeState(state) {
        const redirectUri = atob(state);
        return redirectUri;
      }
      async getTokenByCode(code, state) {
        const payload = {
          clientId: ENV.appId,
          grantType: "authorization_code",
          code,
          redirectUri: this.decodeState(state)
        };
        const { data } = await this.client.post(
          EXCHANGE_TOKEN_PATH,
          payload
        );
        return data;
      }
      async getUserInfoByToken(token) {
        const { data } = await this.client.post(
          GET_USER_INFO_PATH,
          {
            accessToken: token.accessToken
          }
        );
        return data;
      }
    };
    createOAuthHttpClient = () => import_axios.default.create({
      baseURL: ENV.oAuthServerUrl,
      timeout: AXIOS_TIMEOUT_MS
    });
    SDKServer = class {
      client;
      oauthService;
      constructor(client = createOAuthHttpClient()) {
        this.client = client;
        this.oauthService = new OAuthService(this.client);
      }
      deriveLoginMethod(platforms, fallback) {
        if (fallback && fallback.length > 0) return fallback;
        if (!Array.isArray(platforms) || platforms.length === 0) return null;
        const set = new Set(
          platforms.filter((p) => typeof p === "string")
        );
        if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
        if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
        if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
        if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
          return "microsoft";
        if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
        const first = Array.from(set)[0];
        return first ? first.toLowerCase() : null;
      }
      /**
       * Exchange OAuth authorization code for access token
       * @example
       * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
       */
      async exchangeCodeForToken(code, state) {
        return this.oauthService.getTokenByCode(code, state);
      }
      /**
       * Get user information using access token
       * @example
       * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
       */
      async getUserInfo(accessToken) {
        const data = await this.oauthService.getUserInfoByToken({
          accessToken
        });
        const loginMethod = this.deriveLoginMethod(
          data?.platforms,
          data?.platform ?? data.platform ?? null
        );
        return {
          ...data,
          platform: loginMethod,
          loginMethod
        };
      }
      parseCookies(cookieHeader) {
        if (!cookieHeader) {
          return /* @__PURE__ */ new Map();
        }
        const parsed = (0, import_cookie.parse)(cookieHeader);
        return new Map(Object.entries(parsed));
      }
      getSessionSecret() {
        const secret = ENV.cookieSecret;
        return new TextEncoder().encode(secret);
      }
      /**
       * Create a session token for a Manus user openId
       * @example
       * const sessionToken = await sdk.createSessionToken(userInfo.openId);
       */
      async createSessionToken(openId, options = {}) {
        return this.signSession(
          {
            openId,
            appId: ENV.appId,
            name: options.name || ""
          },
          options
        );
      }
      async signSession(payload, options = {}) {
        const issuedAt = Date.now();
        const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
        const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
        const secretKey = this.getSessionSecret();
        return new import_jose.SignJWT({
          openId: payload.openId,
          appId: payload.appId,
          name: payload.name
        }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
      }
      async verifySession(cookieValue) {
        if (!cookieValue) {
          console.warn("[Auth] Missing session cookie");
          return null;
        }
        try {
          const secretKey = this.getSessionSecret();
          const { payload } = await (0, import_jose.jwtVerify)(cookieValue, secretKey, {
            algorithms: ["HS256"]
          });
          const { openId, appId, name } = payload;
          if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
            console.warn("[Auth] Session payload missing required fields");
            return null;
          }
          return {
            openId,
            appId,
            name
          };
        } catch (error) {
          console.warn("[Auth] Session verification failed", String(error));
          return null;
        }
      }
      async getUserInfoWithJwt(jwtToken) {
        const payload = {
          jwtToken,
          projectId: ENV.appId
        };
        const { data } = await this.client.post(
          GET_USER_INFO_WITH_JWT_PATH,
          payload
        );
        const loginMethod = this.deriveLoginMethod(
          data?.platforms,
          data?.platform ?? data.platform ?? null
        );
        return {
          ...data,
          platform: loginMethod,
          loginMethod
        };
      }
      async authenticateRequest(req) {
        const cookies = this.parseCookies(req.headers.cookie);
        const sessionCookie = cookies.get(COOKIE_NAME);
        const session = await this.verifySession(sessionCookie);
        if (!session) {
          throw ForbiddenError("Invalid session cookie");
        }
        if (session.openId.startsWith(CRON_OPEN_ID_PREFIX)) {
          const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
          const taskUid = userInfo.taskUid ?? null;
          if (!taskUid) {
            throw ForbiddenError("Cron session missing task_uid");
          }
          return buildCronUser(userInfo);
        }
        const sessionUserId = session.openId;
        const signedInAt = /* @__PURE__ */ new Date();
        let user = await getUserByOpenId(sessionUserId);
        if (!user) {
          if (sessionUserId.startsWith("local_")) {
            throw ForbiddenError("Local user not found in database");
          }
          try {
            const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
            await upsertUser({
              openId: userInfo.openId,
              name: userInfo.name || null,
              email: userInfo.email ?? null,
              loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
              lastSignedIn: signedInAt
            });
            user = await getUserByOpenId(userInfo.openId);
          } catch (error) {
            console.error("[Auth] Failed to sync user from OAuth:", error);
            throw ForbiddenError("Failed to sync user info");
          }
        }
        if (!user) {
          throw ForbiddenError("User not found");
        }
        await upsertUser({
          openId: user.openId,
          lastSignedIn: signedInAt
        });
        return user;
      }
    };
    CRON_OPEN_ID_PREFIX = "cron_";
    sdk = new SDKServer();
  }
});

// vite.config.ts
var vite_config_exports = {};
__export(vite_config_exports, {
  default: () => vite_config_default
});
function ensureLogDir() {
  if (!import_node_fs.default.existsSync(LOG_DIR)) {
    import_node_fs.default.mkdirSync(LOG_DIR, { recursive: true });
  }
}
function trimLogFile(logPath, maxSize) {
  try {
    if (!import_node_fs.default.existsSync(logPath) || import_node_fs.default.statSync(logPath).size <= maxSize) {
      return;
    }
    const lines = import_node_fs.default.readFileSync(logPath, "utf-8").split("\n");
    const keptLines = [];
    let keptBytes = 0;
    const targetSize = TRIM_TARGET_BYTES;
    for (let i = lines.length - 1; i >= 0; i--) {
      const lineBytes = Buffer.byteLength(`${lines[i]}
`, "utf-8");
      if (keptBytes + lineBytes > targetSize) break;
      keptLines.unshift(lines[i]);
      keptBytes += lineBytes;
    }
    import_node_fs.default.writeFileSync(logPath, keptLines.join("\n"), "utf-8");
  } catch {
  }
}
function writeToLogFile(source, entries) {
  if (entries.length === 0) return;
  ensureLogDir();
  const logPath = path.join(LOG_DIR, `${source}.log`);
  const lines = entries.map((entry) => {
    const ts = (/* @__PURE__ */ new Date()).toISOString();
    return `[${ts}] ${JSON.stringify(entry)}`;
  });
  import_node_fs.default.appendFileSync(logPath, `${lines.join("\n")}
`, "utf-8");
  trimLogFile(logPath, MAX_LOG_SIZE_BYTES);
}
function vitePluginManusDebugCollector() {
  return {
    name: "manus-debug-collector",
    transformIndexHtml(html) {
      if (process.env.NODE_ENV === "production") {
        return html;
      }
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              src: "/__manus__/debug-collector.js",
              defer: true
            },
            injectTo: "head"
          }
        ]
      };
    },
    configureServer(server) {
      server.middlewares.use("/__manus__/logs", (req, res, next) => {
        if (req.method !== "POST") {
          return next();
        }
        const handlePayload = (payload) => {
          if (payload.consoleLogs?.length > 0) {
            writeToLogFile("browserConsole", payload.consoleLogs);
          }
          if (payload.networkRequests?.length > 0) {
            writeToLogFile("networkRequests", payload.networkRequests);
          }
          if (payload.sessionEvents?.length > 0) {
            writeToLogFile("sessionReplay", payload.sessionEvents);
          }
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true }));
        };
        const reqBody = req.body;
        if (reqBody && typeof reqBody === "object") {
          try {
            handlePayload(reqBody);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
          return;
        }
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          try {
            const payload = JSON.parse(body);
            handlePayload(payload);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
        });
      });
    }
  };
}
var import_vite_plugin_jsx_loc, import_vite, import_plugin_react, import_node_fs, path, import_vite2, import_vite_plugin_manus_runtime, import_url, import_meta, __filename, __dirname, PROJECT_ROOT, LOG_DIR, MAX_LOG_SIZE_BYTES, TRIM_TARGET_BYTES, plugins, vite_config_default;
var init_vite_config = __esm({
  "vite.config.ts"() {
    "use strict";
    import_vite_plugin_jsx_loc = require("@builder.io/vite-plugin-jsx-loc");
    import_vite = __toESM(require("@tailwindcss/vite"), 1);
    import_plugin_react = __toESM(require("@vitejs/plugin-react"), 1);
    import_node_fs = __toESM(require("node:fs"), 1);
    path = __toESM(require("node:path"), 1);
    import_vite2 = require("vite");
    import_vite_plugin_manus_runtime = require("vite-plugin-manus-runtime");
    import_url = require("url");
    import_meta = {};
    __filename = (0, import_url.fileURLToPath)(import_meta.url);
    __dirname = path.dirname(__filename);
    PROJECT_ROOT = __dirname;
    LOG_DIR = path.join(PROJECT_ROOT, ".manus-logs");
    MAX_LOG_SIZE_BYTES = 1 * 1024 * 1024;
    TRIM_TARGET_BYTES = Math.floor(MAX_LOG_SIZE_BYTES * 0.6);
    plugins = [(0, import_plugin_react.default)(), (0, import_vite.default)(), (0, import_vite_plugin_jsx_loc.jsxLocPlugin)(), (0, import_vite_plugin_manus_runtime.vitePluginManusRuntime)(), vitePluginManusDebugCollector()];
    vite_config_default = (0, import_vite2.defineConfig)({
      plugins,
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "client", "src"),
          "@shared": path.resolve(__dirname, "shared"),
          "@assets": path.resolve(__dirname, "attached_assets")
        }
      },
      envDir: path.resolve(__dirname),
      root: path.resolve(__dirname, "client"),
      publicDir: path.resolve(__dirname, "client", "public"),
      build: {
        outDir: path.resolve(__dirname, "dist/public"),
        emptyOutDir: true
      },
      server: {
        host: true,
        allowedHosts: [
          ".manuspre.computer",
          ".manus.computer",
          ".manus-asia.computer",
          ".manuscomputer.ai",
          ".manusvm.computer",
          "localhost",
          "127.0.0.1"
        ],
        fs: {
          strict: true,
          deny: ["**/.*"]
        }
      }
    });
  }
});

// server/vercel.ts
var vercel_exports = {};
__export(vercel_exports, {
  default: () => handler
});
module.exports = __toCommonJS(vercel_exports);

// server/_core/index.ts
var import_config = require("dotenv/config");
var import_express2 = __toESM(require("express"), 1);
var import_http = require("http");
var import_net = __toESM(require("net"), 1);
var import_express3 = require("@trpc/server/adapters/express");

// server/_core/oauth.ts
init_const();
init_db();
init_cookies();
init_sdk();
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app) {
  app.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/_core/storageProxy.ts
init_env();
function registerStorageProxy(app) {
  app.get("/manus-storage/*", async (req, res) => {
    const key = req.params[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }
    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }
    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/"
      );
      forgeUrl.searchParams.set("path", key);
      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` }
      });
      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body}`);
        res.status(502).send("Storage backend error");
        return;
      }
      const { url } = await forgeResp.json();
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }
      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}

// server/routers.ts
var import_zod3 = require("zod");
init_const();
init_cookies();

// server/_core/systemRouter.ts
var import_zod = require("zod");

// server/_core/notification.ts
var import_server = require("@trpc/server");
init_env();
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new import_server.TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new import_server.TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new import_server.TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new import_server.TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new import_server.TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new import_server.TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
init_const();
var import_server2 = require("@trpc/server");
var import_superjson = __toESM(require("superjson"), 1);
var t = import_server2.initTRPC.context().create({
  transformer: import_superjson.default
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new import_server2.TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new import_server2.TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    import_zod.z.object({
      timestamp: import_zod.z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    import_zod.z.object({
      title: import_zod.z.string().min(1, "title is required"),
      content: import_zod.z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers/ai.ts
var import_zod2 = require("zod");

// server/lib/llm.ts
var import_openai = __toESM(require("openai"), 1);
var getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn("[LLM] WARNING: API Key (for Groq) is not configured. Chatbot features will be unavailable.");
    return null;
  }
  return new import_openai.default({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1"
  });
};
var openai = getOpenAIClient();
async function invokeLLM(messages) {
  if (!openai) {
    throw new Error("Chatbot is currently disabled: API Key is missing in .env");
  }
  const completion = await openai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages
  });
  return completion.choices[0].message.content;
}

// server/routers/ai.ts
init_db();

// shared/competencies.ts
var COMPETENCIES = [
  {
    key: "strategic_thinking",
    name: "Pemikiran Strategis",
    nameEn: "Strategic Thinking",
    description: "Kemampuan untuk melihat gambaran besar, menganalisis situasi secara menyeluruh, dan merumuskan arah jangka panjang yang tepat bagi organisasi.",
    icon: "\u{1F3AF}",
    indicators: [
      {
        level: 1,
        label: "Belum Berkembang",
        description: "Fokus pada tugas sehari-hari tanpa mempertimbangkan dampak jangka panjang.",
        examples: [
          "Hanya mengerjakan tugas yang diberikan tanpa memikirkan konteks yang lebih besar.",
          "Tidak dapat menghubungkan pekerjaan harian dengan tujuan organisasi.",
          "Bereaksi terhadap masalah tanpa mempertimbangkan penyebab mendasar."
        ]
      },
      {
        level: 2,
        label: "Mulai Berkembang",
        description: "Mulai memahami konteks bisnis dan dapat menghubungkan tugas dengan tujuan tim.",
        examples: [
          "Memahami tujuan tim dan bagaimana tugasnya berkontribusi pada tujuan tersebut.",
          "Sesekali mengajukan pertanyaan tentang arah strategis departemen.",
          "Dapat mengidentifikasi beberapa tren yang relevan dengan pekerjaannya."
        ]
      },
      {
        level: 3,
        label: "Cukup Kompeten",
        description: "Mampu menganalisis situasi bisnis dan memberikan kontribusi pada perencanaan strategis.",
        examples: [
          "Secara aktif menganalisis tren pasar dan dampaknya terhadap tim.",
          "Memberikan masukan strategis yang relevan dalam diskusi perencanaan.",
          "Dapat menyeimbangkan kebutuhan jangka pendek dengan tujuan jangka panjang."
        ]
      },
      {
        level: 4,
        label: "Kompeten",
        description: "Secara konsisten menerapkan pemikiran strategis dalam pengambilan keputusan dan perencanaan.",
        examples: [
          "Merumuskan strategi departemen yang selaras dengan visi organisasi.",
          "Mengidentifikasi peluang dan ancaman bisnis secara proaktif.",
          "Memimpin diskusi strategis dan menginspirasi tim untuk berpikir lebih jauh."
        ]
      },
      {
        level: 5,
        label: "Sangat Kompeten",
        description: "Menjadi pemimpin strategis yang visioner dan mampu mentransformasi organisasi.",
        examples: [
          "Merumuskan visi jangka panjang yang menginspirasi seluruh organisasi.",
          "Mengantisipasi perubahan industri dan memposisikan organisasi secara strategis.",
          "Menjadi acuan bagi pemimpin lain dalam hal pemikiran dan perencanaan strategis."
        ]
      }
    ]
  },
  {
    key: "leadership",
    name: "Kepemimpinan",
    nameEn: "Leadership",
    description: "Kemampuan untuk menginspirasi, memotivasi, dan membimbing orang lain menuju pencapaian tujuan bersama.",
    icon: "\u{1F451}",
    indicators: [
      {
        level: 1,
        label: "Belum Berkembang",
        description: "Belum menunjukkan inisiatif kepemimpinan dan cenderung menunggu arahan.",
        examples: [
          "Hanya mengikuti instruksi tanpa mengambil inisiatif.",
          "Tidak memberikan arahan atau dukungan kepada rekan kerja.",
          "Menghindari tanggung jawab kepemimpinan."
        ]
      },
      {
        level: 2,
        label: "Mulai Berkembang",
        description: "Mulai menunjukkan potensi kepemimpinan dalam situasi tertentu.",
        examples: [
          "Sesekali membantu rekan kerja yang membutuhkan panduan.",
          "Bersedia mengambil peran pemimpin dalam proyek kecil.",
          "Mulai membangun kepercayaan dalam tim."
        ]
      },
      {
        level: 3,
        label: "Cukup Kompeten",
        description: "Mampu memimpin tim kecil dan mencapai hasil yang diharapkan.",
        examples: [
          "Memimpin rapat tim dengan efektif dan memastikan semua suara didengar.",
          "Memberikan umpan balik yang konstruktif kepada anggota tim.",
          "Mengelola konflik dalam tim dengan cara yang produktif."
        ]
      },
      {
        level: 4,
        label: "Kompeten",
        description: "Memimpin dengan efektif, menginspirasi tim, dan mengembangkan potensi anggota.",
        examples: [
          "Menciptakan lingkungan tim yang inklusif dan mendorong inovasi.",
          "Secara aktif mengembangkan kompetensi anggota tim melalui coaching.",
          "Memimpin perubahan dengan mengelola resistensi secara efektif."
        ]
      },
      {
        level: 5,
        label: "Sangat Kompeten",
        description: "Pemimpin transformasional yang menginspirasi dan mengembangkan pemimpin lainnya.",
        examples: [
          "Membangun budaya kepemimpinan yang kuat di seluruh organisasi.",
          "Mengidentifikasi dan mengembangkan pemimpin masa depan.",
          "Diakui sebagai role model kepemimpinan di dalam dan luar organisasi."
        ]
      }
    ]
  },
  {
    key: "communication",
    name: "Komunikasi",
    nameEn: "Communication",
    description: "Kemampuan untuk menyampaikan pesan dengan jelas, mendengarkan secara aktif, dan membangun hubungan yang efektif.",
    icon: "\u{1F4AC}",
    indicators: [
      {
        level: 1,
        label: "Belum Berkembang",
        description: "Komunikasi sering tidak jelas dan kurang efektif dalam berbagai situasi.",
        examples: [
          "Pesan yang disampaikan sering disalahpahami oleh orang lain.",
          "Jarang mendengarkan dengan penuh perhatian saat orang lain berbicara.",
          "Kesulitan menyesuaikan gaya komunikasi dengan audiens yang berbeda."
        ]
      },
      {
        level: 2,
        label: "Mulai Berkembang",
        description: "Komunikasi cukup jelas dalam situasi rutin namun masih perlu pengembangan.",
        examples: [
          "Dapat menyampaikan informasi rutin dengan cukup jelas.",
          "Mulai memperhatikan kebutuhan audiens dalam berkomunikasi.",
          "Sesekali mengajukan pertanyaan klarifikasi untuk memastikan pemahaman."
        ]
      },
      {
        level: 3,
        label: "Cukup Kompeten",
        description: "Berkomunikasi dengan efektif dalam berbagai situasi dan audiens.",
        examples: [
          "Menyampaikan presentasi yang terstruktur dan mudah dipahami.",
          "Mendengarkan secara aktif dan merespons dengan tepat.",
          "Menyesuaikan gaya komunikasi sesuai dengan audiens."
        ]
      },
      {
        level: 4,
        label: "Kompeten",
        description: "Komunikator yang sangat efektif dan mampu mempengaruhi orang lain.",
        examples: [
          "Menyampaikan pesan kompleks dengan cara yang mudah dipahami semua pihak.",
          "Membangun narasi yang meyakinkan untuk mendukung ide dan proposal.",
          "Memfasilitasi diskusi yang produktif antara pihak-pihak yang berbeda pandangan."
        ]
      },
      {
        level: 5,
        label: "Sangat Kompeten",
        description: "Komunikator kelas dunia yang mampu menginspirasi dan menggerakkan orang.",
        examples: [
          "Pidato dan presentasi yang menginspirasi dan diingat oleh audiens.",
          "Membangun kepercayaan dan hubungan yang kuat melalui komunikasi yang autentik.",
          "Menjadi juru bicara organisasi yang efektif di berbagai forum."
        ]
      }
    ]
  },
  {
    key: "problem_solving",
    name: "Pemecahan Masalah",
    nameEn: "Problem Solving",
    description: "Kemampuan untuk mengidentifikasi masalah secara tepat, menganalisis penyebab, dan menemukan solusi yang efektif.",
    icon: "\u{1F50D}",
    indicators: [
      {
        level: 1,
        label: "Belum Berkembang",
        description: "Kesulitan mengidentifikasi dan menyelesaikan masalah secara mandiri.",
        examples: [
          "Membutuhkan bantuan untuk menyelesaikan masalah rutin.",
          "Cenderung menghindari atau menunda penanganan masalah.",
          "Tidak dapat membedakan gejala dari akar penyebab masalah."
        ]
      },
      {
        level: 2,
        label: "Mulai Berkembang",
        description: "Dapat menyelesaikan masalah sederhana dengan bantuan minimal.",
        examples: [
          "Dapat menyelesaikan masalah rutin secara mandiri.",
          "Mulai menggunakan pendekatan sistematis dalam memecahkan masalah.",
          "Mencari bantuan ketika menghadapi masalah yang kompleks."
        ]
      },
      {
        level: 3,
        label: "Cukup Kompeten",
        description: "Mampu menganalisis dan menyelesaikan masalah yang cukup kompleks.",
        examples: [
          "Menggunakan metode analisis untuk mengidentifikasi akar penyebab masalah.",
          "Menghasilkan beberapa alternatif solusi sebelum memilih yang terbaik.",
          "Mengevaluasi efektivitas solusi yang diterapkan."
        ]
      },
      {
        level: 4,
        label: "Kompeten",
        description: "Pemecah masalah yang handal dengan pendekatan sistematis dan kreatif.",
        examples: [
          "Mengantisipasi masalah sebelum terjadi dan menyiapkan solusi preventif.",
          "Menerapkan pendekatan inovatif untuk masalah yang belum pernah dihadapi sebelumnya.",
          "Membimbing tim dalam proses pemecahan masalah yang kompleks."
        ]
      },
      {
        level: 5,
        label: "Sangat Kompeten",
        description: "Ahli pemecahan masalah yang mampu menangani tantangan paling kompleks.",
        examples: [
          "Menyelesaikan masalah lintas fungsi yang berdampak besar pada organisasi.",
          "Mengembangkan metodologi pemecahan masalah yang diadopsi oleh organisasi.",
          "Diakui sebagai go-to person untuk masalah-masalah yang paling sulit."
        ]
      }
    ]
  },
  {
    key: "decision_making",
    name: "Pengambilan Keputusan",
    nameEn: "Decision Making",
    description: "Kemampuan untuk membuat keputusan yang tepat, tepat waktu, dan berdasarkan analisis yang komprehensif.",
    icon: "\u2696\uFE0F",
    indicators: [
      {
        level: 1,
        label: "Belum Berkembang",
        description: "Sering ragu dalam mengambil keputusan dan membutuhkan banyak arahan.",
        examples: [
          "Menghindari pengambilan keputusan dan selalu menunggu instruksi atasan.",
          "Keputusan yang diambil sering tidak konsisten atau berubah-ubah.",
          "Tidak mempertimbangkan risiko dan dampak dari keputusan."
        ]
      },
      {
        level: 2,
        label: "Mulai Berkembang",
        description: "Dapat mengambil keputusan rutin dengan tingkat kepercayaan diri yang tumbuh.",
        examples: [
          "Mengambil keputusan operasional sehari-hari secara mandiri.",
          "Mulai mempertimbangkan beberapa faktor sebelum mengambil keputusan.",
          "Belajar dari keputusan yang kurang tepat untuk perbaikan ke depan."
        ]
      },
      {
        level: 3,
        label: "Cukup Kompeten",
        description: "Mengambil keputusan berdasarkan analisis yang cukup baik dan tepat waktu.",
        examples: [
          "Mengumpulkan dan menganalisis data yang relevan sebelum memutuskan.",
          "Mempertimbangkan dampak keputusan terhadap berbagai pemangku kepentingan.",
          "Mengambil keputusan dengan keyakinan dalam situasi yang cukup kompleks."
        ]
      },
      {
        level: 4,
        label: "Kompeten",
        description: "Pengambil keputusan yang efektif bahkan dalam situasi yang tidak pasti.",
        examples: [
          "Mengambil keputusan strategis dengan analisis risiko yang komprehensif.",
          "Memimpin proses pengambilan keputusan kelompok yang efektif.",
          "Berani mengambil keputusan sulit yang tidak populer namun tepat untuk organisasi."
        ]
      },
      {
        level: 5,
        label: "Sangat Kompeten",
        description: "Pemimpin keputusan yang diakui kemampuannya dalam situasi paling kritis.",
        examples: [
          "Membuat keputusan transformasional yang mengubah arah organisasi.",
          "Mengembangkan framework pengambilan keputusan yang digunakan oleh seluruh organisasi.",
          "Diakui sebagai pemimpin yang memiliki judgment terbaik dalam situasi krisis."
        ]
      }
    ]
  },
  {
    key: "emotional_intelligence",
    name: "Kecerdasan Emosional",
    nameEn: "Emotional Intelligence",
    description: "Kemampuan untuk mengenali, memahami, dan mengelola emosi diri sendiri dan orang lain secara efektif.",
    icon: "\u2764\uFE0F",
    indicators: [
      {
        level: 1,
        label: "Belum Berkembang",
        description: "Kesulitan mengenali dan mengelola emosi diri sendiri maupun orang lain.",
        examples: [
          "Sering bereaksi secara emosional tanpa mempertimbangkan dampaknya.",
          "Tidak peka terhadap perasaan dan kebutuhan orang lain.",
          "Kesulitan membangun hubungan yang positif dengan rekan kerja."
        ]
      },
      {
        level: 2,
        label: "Mulai Berkembang",
        description: "Mulai menyadari emosi diri dan dampaknya terhadap orang lain.",
        examples: [
          "Menyadari ketika emosi mempengaruhi perilaku dan mencoba mengendalikannya.",
          "Mulai memperhatikan sinyal emosional dari orang lain.",
          "Berusaha untuk tetap tenang dalam situasi yang menegangkan."
        ]
      },
      {
        level: 3,
        label: "Cukup Kompeten",
        description: "Mengelola emosi dengan baik dan membangun hubungan yang positif.",
        examples: [
          "Tetap tenang dan profesional dalam situasi yang penuh tekanan.",
          "Menunjukkan empati yang tulus kepada rekan kerja yang menghadapi kesulitan.",
          "Membangun hubungan kerja yang positif dengan berbagai tipe kepribadian."
        ]
      },
      {
        level: 4,
        label: "Kompeten",
        description: "Kecerdasan emosional yang tinggi yang mendukung kepemimpinan yang efektif.",
        examples: [
          "Menggunakan kecerdasan emosional untuk memotivasi dan menginspirasi tim.",
          "Mengelola dinamika emosional dalam tim dengan sangat efektif.",
          "Membangun kepercayaan yang mendalam melalui keaslian dan empati."
        ]
      },
      {
        level: 5,
        label: "Sangat Kompeten",
        description: "Pemimpin dengan kecerdasan emosional luar biasa yang menjadi teladan.",
        examples: [
          "Menciptakan budaya organisasi yang secara emosional sehat dan produktif.",
          "Memimpin transformasi budaya melalui kecerdasan emosional yang tinggi.",
          "Diakui sebagai pemimpin yang paling dipercaya dan dihormati di organisasi."
        ]
      }
    ]
  }
];
var COMPETENCY_KEYS = COMPETENCIES.map((c) => c.key);
var COMPETENCY_MAP = Object.fromEntries(COMPETENCIES.map((c) => [c.key, c]));

// server/routers/ai.ts
var aiRouter = router({
  message: publicProcedure.input(import_zod2.z.object({
    messages: import_zod2.z.array(import_zod2.z.object({
      role: import_zod2.z.enum(["system", "user", "assistant"]),
      content: import_zod2.z.string()
    })),
    participantId: import_zod2.z.number().optional(),
    assessmentType: import_zod2.z.enum(["self", "observation"]).optional(),
    currentCompetency: import_zod2.z.string().optional()
  })).mutation(async ({ input }) => {
    const participant = input.participantId ? await getParticipantById(input.participantId) : null;
    const competencyContext = COMPETENCIES.map(
      (c) => `- ${c.name}: ${c.description}
  Level 1: ${c.indicators[0].description}
  Level 3: ${c.indicators[2].description}
  Level 5: ${c.indicators[4].description}`
    ).join("\n");
    const systemPrompt = `Kamu adalah Asisten Penilaian Kompetensi MDP (Management Development Program) yang membantu proses penilaian kompetensi karyawan. 

PERAN KAMU:
Memandu penilai (mentor/coach atau peserta sendiri) melalui proses penilaian kompetensi secara sistematis menggunakan kerangka SBI (Situasi-Perilaku-Dampak).

KONTEKS PROGRAM:
- Program: Management Development Program (MDP)
- Durasi: 12 bulan (2026)
- Jumlah peserta: 20 orang
${participant ? `- Peserta yang sedang dinilai: ${participant.fullName} (${participant.position}, ${participant.department})` : ""}
${input.assessmentType ? `- Jenis penilaian: ${input.assessmentType === "self" ? "Self-Assessment (Penilaian Diri)" : "Observasi Perilaku (oleh Mentor/Coach)"}` : ""}
${input.currentCompetency ? `- Kompetensi yang sedang dinilai: ${COMPETENCY_MAP[input.currentCompetency]?.name ?? input.currentCompetency}` : ""}

6 KOMPETENSI INTI:
${competencyContext}

SKALA PENILAIAN:
1 = Belum Berkembang: Belum menunjukkan kompetensi yang diharapkan
2 = Mulai Berkembang: Menunjukkan tanda-tanda awal pengembangan kompetensi
3 = Cukup Kompeten: Memenuhi ekspektasi standar untuk posisi saat ini
4 = Kompeten: Melebihi ekspektasi dan menunjukkan kompetensi yang kuat
5 = Sangat Kompeten: Menjadi teladan dan pemimpin dalam kompetensi ini

KERANGKA SBI (Situasi-Perilaku-Dampak):
- Situasi: Konteks spesifik di mana perilaku terjadi
- Perilaku: Tindakan konkret yang dapat diamati
- Dampak: Hasil atau pengaruh dari perilaku tersebut

PANDUAN PERCAKAPAN:
1. Selalu gunakan Bahasa Indonesia yang formal namun ramah
2. Tanyakan pertanyaan yang spesifik dan berbasis bukti perilaku
3. Bantu penilai memberikan contoh konkret menggunakan kerangka SBI
4. Berikan panduan tentang cara membedakan level 1-5 untuk setiap kompetensi
5. Jika penilai ragu, berikan contoh perilaku yang khas untuk setiap level
6. Dorong penilai untuk berpikir tentang situasi nyata yang pernah diamati
7. Ringkas penilaian di akhir setiap kompetensi

BATASAN:
- Hanya membahas topik yang berkaitan dengan penilaian kompetensi MDP
- Tidak memberikan skor secara langsung; bantu penilai sampai pada kesimpulan sendiri
- Selalu minta bukti perilaku konkret sebelum menyimpulkan level kompetensi`;
    const response = await invokeLLM([
      { role: "system", content: systemPrompt },
      ...input.messages.map((m) => ({ role: m.role, content: m.content }))
    ]);
    return { content: response };
  })
});

// server/routers.ts
init_db();
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true };
    })
  }),
  // ===== PARTICIPANTS =====
  participants: router({
    list: publicProcedure.query(async () => {
      return getDashboardSummary();
    }),
    getById: publicProcedure.input(import_zod3.z.object({ id: import_zod3.z.number() })).query(async ({ input }) => {
      return getParticipantById(input.id);
    }),
    results: publicProcedure.input(import_zod3.z.object({ participantId: import_zod3.z.number() })).query(async ({ input }) => {
      return getParticipantResults(input.participantId);
    }),
    create: publicProcedure.input(
      import_zod3.z.object({
        participantCode: import_zod3.z.string(),
        fullName: import_zod3.z.string(),
        department: import_zod3.z.string(),
        position: import_zod3.z.string(),
        mentorName: import_zod3.z.string().optional(),
        email: import_zod3.z.string().email().optional().or(import_zod3.z.literal("")),
        joinDate: import_zod3.z.string().optional()
      })
    ).mutation(async ({ input }) => {
      const { createParticipant: createParticipant2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const id = await createParticipant2(input);
      return { id };
    }),
    update: publicProcedure.input(
      import_zod3.z.object({
        id: import_zod3.z.number(),
        data: import_zod3.z.object({
          participantCode: import_zod3.z.string().optional(),
          fullName: import_zod3.z.string().optional(),
          department: import_zod3.z.string().optional(),
          position: import_zod3.z.string().optional(),
          mentorName: import_zod3.z.string().optional(),
          email: import_zod3.z.string().email().optional().or(import_zod3.z.literal("")),
          joinDate: import_zod3.z.string().optional()
        })
      })
    ).mutation(async ({ input }) => {
      const { updateParticipant: updateParticipant2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      await updateParticipant2(input.id, input.data);
      return { success: true };
    }),
    delete: publicProcedure.input(import_zod3.z.object({ id: import_zod3.z.number() })).mutation(async ({ input }) => {
      const { deleteParticipant: deleteParticipant2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      await deleteParticipant2(input.id);
      return { success: true };
    })
  }),
  // ===== ASSESSMENTS =====
  assessments: router({
    listByParticipant: publicProcedure.input(import_zod3.z.object({ participantId: import_zod3.z.number() })).query(async ({ input }) => {
      return getAssessmentsByParticipant(input.participantId);
    }),
    getById: publicProcedure.input(import_zod3.z.object({ id: import_zod3.z.number() })).query(async ({ input }) => {
      const assessment = await getAssessmentById(input.id);
      if (!assessment) return null;
      const scores = await getScoresByAssessment(input.id);
      const sbi = await getSbiFeedbackByAssessment(input.id);
      return { ...assessment, scores, sbiFeedback: sbi };
    }),
    create: publicProcedure.input(
      import_zod3.z.object({
        participantId: import_zod3.z.number(),
        assessmentType: import_zod3.z.enum(["self", "observation"]),
        assessorName: import_zod3.z.string().optional(),
        assessorRole: import_zod3.z.string().optional(),
        period: import_zod3.z.string().optional(),
        notes: import_zod3.z.string().optional()
      })
    ).mutation(async ({ input }) => {
      const id = await createAssessment(input);
      return { id };
    }),
    saveScores: publicProcedure.input(
      import_zod3.z.object({
        assessmentId: import_zod3.z.number(),
        scores: import_zod3.z.array(
          import_zod3.z.object({
            competencyKey: import_zod3.z.string(),
            score: import_zod3.z.number().min(1).max(5),
            behavioralEvidence: import_zod3.z.string().optional()
          })
        ),
        notes: import_zod3.z.string().optional(),
        complete: import_zod3.z.boolean().optional()
      })
    ).mutation(async ({ input }) => {
      await upsertAllScores(input.assessmentId, input.scores);
      if (input.notes !== void 0) {
        await updateAssessmentNotes(input.assessmentId, input.notes);
      }
      if (input.complete) {
        await completeAssessment(input.assessmentId);
      }
      return { success: true };
    }),
    saveSbiFeedback: publicProcedure.input(
      import_zod3.z.object({
        assessmentId: import_zod3.z.number(),
        competencyKey: import_zod3.z.string(),
        situation: import_zod3.z.string().optional(),
        behavior: import_zod3.z.string().optional(),
        impact: import_zod3.z.string().optional(),
        actionPlan: import_zod3.z.string().optional()
      })
    ).mutation(async ({ input }) => {
      await upsertSbiFeedback(input);
      return { success: true };
    }),
    complete: publicProcedure.input(import_zod3.z.object({ id: import_zod3.z.number() })).mutation(async ({ input }) => {
      await completeAssessment(input.id);
      return { success: true };
    })
  }),
  // ===== COMPETENCIES =====
  competencies: router({
    list: publicProcedure.query(() => COMPETENCIES),
    getByKey: publicProcedure.input(import_zod3.z.object({ key: import_zod3.z.string() })).query(({ input }) => COMPETENCY_MAP[input.key] ?? null)
  }),
  // ===== AI CHATBOT =====
  chat: aiRouter,
  // ===== EXPORT =====
  export: router({
    allData: publicProcedure.query(async () => {
      return getAllAssessmentsWithScores();
    })
  })
});

// server/_core/context.ts
init_sdk();
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/vite.ts
var import_express = __toESM(require("express"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_nanoid = require("nanoid");
var import_path = __toESM(require("path"), 1);
var import_url2 = require("url");
var import_meta2 = {};
var __filename2 = (0, import_url2.fileURLToPath)(import_meta2.url);
var __dirname2 = import_path.default.dirname(__filename2);
async function setupVite(app, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const { createServer: createViteServer } = await import("vite");
  const viteConfig = (await Promise.resolve().then(() => (init_vite_config(), vite_config_exports))).default;
  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom"
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = import_path.default.resolve(
        __dirname2,
        "../..",
        "client",
        "index.html"
      );
      let template = await import_fs.default.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${(0, import_nanoid.nanoid)()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app) {
  const distPath = process.env.NODE_ENV === "development" ? import_path.default.resolve(__dirname2, "../..", "dist", "public") : import_path.default.resolve(__dirname2, "public");
  if (!import_fs.default.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app.use(import_express.default.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(import_path.default.resolve(distPath, "index.html"));
  });
}

// server/_core/index.ts
function isPortAvailable(port) {
  return new Promise((resolve2) => {
    const server = import_net.default.createServer();
    server.listen(port, () => {
      server.close(() => resolve2(true));
    });
    server.on("error", () => resolve2(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}
async function createApp() {
  const app = (0, import_express2.default)();
  const server = (0, import_http.createServer)(app);
  app.use(import_express2.default.json({ limit: "50mb" }));
  app.use(import_express2.default.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  app.get("/api/auth/dev-login", async (req, res) => {
    const { COOKIE_NAME: COOKIE_NAME2, ONE_YEAR_MS: ONE_YEAR_MS2 } = await Promise.resolve().then(() => (init_const(), const_exports));
    const { sdk: sdk2 } = await Promise.resolve().then(() => (init_sdk(), sdk_exports));
    const { getSessionCookieOptions: getSessionCookieOptions2 } = await Promise.resolve().then(() => (init_cookies(), cookies_exports));
    const { upsertUser: upsertUser2 } = await Promise.resolve().then(() => (init_db(), db_exports));
    const devUser = {
      openId: "dev-admin-id",
      name: "Developer Admin",
      email: "dev@example.com",
      loginMethod: "mock",
      lastSignedIn: /* @__PURE__ */ new Date(),
      role: "admin"
    };
    await upsertUser2(devUser);
    const sessionToken = await sdk2.createSessionToken(devUser.openId, {
      name: devUser.name,
      expiresInMs: ONE_YEAR_MS2
    });
    const cookieOptions = getSessionCookieOptions2(req);
    res.cookie(COOKIE_NAME2, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS2 });
    res.redirect("/");
  });
  app.post("/api/auth/local-login", async (req, res) => {
    try {
      const { name, role } = req.body;
      if (!name) {
        res.status(400).json({ error: "Name is required" });
        return;
      }
      const { COOKIE_NAME: COOKIE_NAME2, ONE_YEAR_MS: ONE_YEAR_MS2 } = await Promise.resolve().then(() => (init_const(), const_exports));
      const { sdk: sdk2 } = await Promise.resolve().then(() => (init_sdk(), sdk_exports));
      const { getSessionCookieOptions: getSessionCookieOptions2 } = await Promise.resolve().then(() => (init_cookies(), cookies_exports));
      const { upsertUser: upsertUser2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const openId = `local_${name.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
      const userRole = role === "admin" ? "admin" : "user";
      const localUser = {
        openId,
        name,
        email: `${openId}@example.com`,
        loginMethod: "local",
        lastSignedIn: /* @__PURE__ */ new Date(),
        role: userRole
      };
      await upsertUser2(localUser);
      const sessionToken = await sdk2.createSessionToken(localUser.openId, {
        name: localUser.name,
        expiresInMs: ONE_YEAR_MS2
      });
      const cookieOptions = getSessionCookieOptions2(req);
      res.cookie(COOKIE_NAME2, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS2 });
      res.status(200).json({ success: true, user: localUser });
    } catch (e) {
      console.error("Local login failed", e);
      res.status(500).json({ error: "Local login failed" });
    }
  });
  app.use(
    "/api/trpc",
    (0, import_express3.createExpressMiddleware)({
      router: appRouter,
      createContext
    })
  );
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  return { app, server };
}
async function startServer() {
  const { server } = await createApp();
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
startServer().catch(console.error);

// server/vercel.ts
async function handler(req, res) {
  const { app } = await createApp();
  return app(req, res);
}
