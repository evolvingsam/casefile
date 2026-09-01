/**
 * route.ts — Next.js Server API Endpoint for Casefile
 *
 * Handles WebMCP tool executions and UI investigation actions on the Node.js server.
 * Ensures zero secret leakage to client JS bundles.
 */

import { NextRequest, NextResponse } from 'next/server';
import { caseServerService, ActiveStateParams } from '@/server/services/caseServerService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, params, state } = body as {
      action: string;
      params: Record<string, any>;
      state: ActiveStateParams;
    };

    if (!action) {
      return NextResponse.json({ success: false, error: 'Action parameter is required' }, { status: 400 });
    }

    const stateParams: ActiveStateParams = {
      caseId: state?.caseId || 'gallery-murder-047',
      visitedLocationIds: state?.visitedLocationIds || [],
      discoveredEvidenceIds: state?.discoveredEvidenceIds || [],
      inspectedEvidenceIds: state?.inspectedEvidenceIds || [],
      interviewedSuspectIds: state?.interviewedSuspectIds || [],
      interviews: state?.interviews || [],
    };

    // Action 1: inspect_evidence (Problem 1 & 2)
    if (action === 'inspect_evidence') {
      const evidenceId = params?.evidence_id || params?.evidenceId;
      if (!evidenceId) {
        return NextResponse.json({ success: false, error: 'Parameter "evidence_id" is required.' }, { status: 400 });
      }

      const result = caseServerService.inspectEvidence(evidenceId, stateParams);
      return NextResponse.json(result);
    }

    // Action 2: submit_accusation (Problem 3 & 9)
    if (action === 'submit_accusation') {
      const suspectId = params?.suspect_id || params?.suspectId;
      const reasoning = params?.reasoning || '';
      if (!suspectId) {
        return NextResponse.json({ success: false, error: 'Parameter "suspect_id" is required.' }, { status: 400 });
      }

      const result = caseServerService.submitAccusation(suspectId, reasoning, stateParams);
      return NextResponse.json(result);
    }

    // Action 3: get_case_state (Problem 5)
    if (action === 'get_case_state') {
      const result = caseServerService.getCaseState(stateParams);
      return NextResponse.json({ success: true, data: result });
    }

    // Action 4: evaluate_deductions
    if (action === 'evaluate_deductions') {
      const result = caseServerService.evaluateDeductions(stateParams);
      return NextResponse.json({ success: true, data: result });
    }

    return NextResponse.json({ success: false, error: `Unknown action "${action}"` }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Server error processing investigation action' },
      { status: 500 },
    );
  }
}
