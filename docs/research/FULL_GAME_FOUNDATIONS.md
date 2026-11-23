# Full-game physical foundations

Research date: 2026-09-07  
Question: Which real constraints can turn post-v1 growth from a data-center computer into planetary, stellar, and interstellar computation into new decisions, while supporting the Quest for Meaning?

## Executive answer

Use real limits as sources of understandable decisions, with explicitly fictional engineering and compressed time. Expansion can create enormous useful capacity without producing literal infinity. The final narrative turn should concern the question being asked and what counts as an answer. Physics does not establish the meaning of life; that interpretation belongs to the game's original story.

These are research findings and proposed implications, not an implementation specification. The canonical product, mechanics, and full-game plan decide which proposals to adopt.

## Six constraints worth retaining

### 1. More processors do not make every job proportionally faster

**Established basis.** For a fixed workload, Amdahl's simplified speedup model is `1 / (S + P/N)`, where `S` is its serial fraction, `P` its parallel fraction, and `N` the processor count. A nonzero serial fraction limits speedup as processors increase. Communication and synchronization add overhead. Independent jobs scale differently from a tightly coupled calculation; growing the workload is also different from accelerating one fixed workload. [Lawrence Livermore National Laboratory: Introduction to Parallel Computing](https://hpc.llnl.gov/documentation/tutorials/introduction-parallel-computing-tutorial)

**Proposed implication.** Planetary compute introduces workload placement: keep dependent stages together and spread independent batches across regions. A deterministic Benchmark contrasts aggregate throughput with time to finish one dependent calculation. Improving the algorithm should occasionally beat buying another region.

**Simplification.** Use a few visible workload classes and an explained coordination penalty. Do not require players to solve network topology or treat Amdahl's model as a universal cap on all future computing.

### 2. More bandwidth cannot remove travel time

**Established basis.** NASA describes signal transit time as distance divided by light speed. Communication relays can help with blackouts but cannot eliminate the propagation delay. Delays force greater local autonomy. [NASA: Mars Communications Disruption and Delay](https://www.nasa.gov/wp-content/uploads/2024/01/mars-communications-disruption-and-delay.pdf)

**Proposed implication.** Stellar and interstellar clusters run local policies, then exchange batched results. Bandwidth improves volume transferred; latency determines when a result can first arrive. Give the player forecasts and useful concurrent work instead of mandatory real-time waits.

**Simplification and vocabulary.** Compress fictional travel times and show that the game clock is accelerated. Ordinary distant stars are latency-separated, not necessarily permanently causally disconnected. A cluster's result cannot affect a final calculation until its message arrives. If a later story uses a true causal horizon, exclude those inaccessible resources from usable compute. Do not introduce quantum messaging or another unexplained faster-than-light bypass.

### 3. Space changes cooling; it does not delete it

**Established basis.** NASA's spacecraft thermal model balances absorbed heat and internal generation against stored heat and radiation. Vacuum prevents convection to the environment. Radiator area, emissivity, temperature, orientation, and exposure affect heat rejection. [NASA: Small Spacecraft Technology, Thermal Control](https://www.nasa.gov/smallsat-institute/sst-soa/thermal-control/)

**Proposed implication.** Stellar infrastructure allocates construction between collectors, processors, and radiators. A collector increases available power; it does not directly increase sustainable computation when heat rejection is limiting. This supplies an understandable sequel to the PC's fan and rack's cooling budget.

**Invention.** A self-constructing swarm capable of harvesting a substantial fraction of stellar output is speculative game infrastructure. The NASA source supports the thermal relationships, not the feasibility, costs, or build speed of that swarm. Represent these relationships through an inspectable budget rather than a realistic spacecraft simulator.

### 4. Erasure has a thermodynamic cost under specified conditions

**Established basis.** Experiments with physical one-bit memories support the Landauer bound: in the standard thermal setting, irreversible erasure of an unknown bit has a minimum average heat cost of `k_B T ln(2)`. This is an erasure bound, not a claim that every possible logical operation has that same unavoidable cost. [Bérut et al., experimental verification, Nature (2012)](https://www.nature.com/articles/nature10872), [Hong et al., nanomagnetic memory experiment](https://arxiv.org/abs/1411.6730)

**Proposed implication.** Late efficiency Research can reduce discarded intermediate information or choose between memory use and heat. Explain the tradeoff as a specific machine design. It must not imply that reversible logic, colder components, or recycling magically supplies unbounded free computation.

**Simplification.** This is optional supporting flavor for a single efficiency mechanic. V1 cooling should remain based on familiar power and thermal budgets, without making players learn thermodynamic notation.

### 5. Quantum computers are specialized partners

**Established basis.** IBM's instructional material describes quantum and classical HPC as complementary. Quantum methods may help particular problem structures; classical systems still compile circuits, manage measurements, and process results. Quantum computation does not remove combinatorial and thermodynamic limits in general. [IBM Quantum Learning: Integrating Quantum and High-Performance Computing](https://quantum.cloud.ibm.com/learning/en/courses/integrating-quantum-and-high-performance-computing/introduction)

**Proposed implication.** If quantum hardware appears, route a specific simulation workload to it and keep ordinary jobs on classical hardware. Its marketing can promise universal transformation while Task Manager reveals an exact, narrow benefit. A quantum upgrade should not multiply every resource or certify that an existential question has an objective answer.

**Invention.** The game's useful devices, efficiencies, and reliable operation at enormous scale are fictional. Avoid predictions about commercial timelines or claims that quantum algorithms solve all hard optimization problems efficiently.

### 6. Finite physical computers retain finite limits

**Established basis.** Seth Lloyd's physical analysis relates processing speed to available energy and information capacity to physical degrees of freedom, considering light speed, quantum mechanics, and gravity. These are idealized limits, not a construction recipe. [Lloyd: Ultimate Physical Limits to Computation, author manuscript](https://arxiv.org/abs/quant-ph/9908043), [published paper, Nature (2000)](https://www.nature.com/articles/35023282)

**Proposed implication.** Keep every playable quantity finite. The project may call its ambition “infinite compute,” but ever larger finite hardware does not satisfy that claim. Build a finite finale around an explicit result, its missing interpretation, and the decision to define a meaningful question. Preserve the player's engineering achievements; the realization should expand their significance rather than announce that the entire game was pointless.

**Limit of the evidence.** These sources do not settle the universe's global size, its ultimate fate, or whether meaning can be formalized. Do not present a precise cosmic maximum, the nonexistence of meaning, or the game's eventual `42` as a scientific finding.

## Proposed progression using these facts

| Scale | New decision | What becomes background work | Satirical pressure to expose |
| --- | --- | --- | --- |
| Data center → planetary network | Place jobs near their data and distinguish serial from independent work. | Individual machine purchases and local queue maintenance. | Selling “the cloud” as though location and infrastructure stopped existing. |
| Planetary → stellar swarm | Balance collectors, processors, and heat rejection. | Regional purchasing becomes a deployment policy. | Calling energy collection progress while the useful-work graph stays flat. |
| Stellar → interstellar clusters | Choose autonomous policies and batch results around latency. | Repeating the stellar build becomes a saved construction template. | Advertising a universal real-time platform whose updates arrive generations late. |
| Final finite calculation | Establish what the question means and how a result would answer it. | Routine expansion no longer demands attention. | Reporting a perfect metric with no agreed definition of success. |

This table is an original design proposal inferred from the findings. The jokes target fictional industry incentives and claims. They should appear through purchase descriptions, reports, and system behavior; short sincere exchanges can gradually expose why the OS keeps asking for more compute.

## Planning boundaries

- Scientific relationships support clear cause, exact effect, and recovery; they are not surprise punishments.
- Use seeded, deterministic simulations and short Benchmark retries. Cosmological scale is not a reason to add weeks of mandatory waiting.
- Treat elapsed fictional years, aggregate infrastructure, and simplified workload classes as declared abstractions.
- Keep real `Infinity`, `NaN`, and overflow out of economy/save state. The impossible aspiration is narrative language, not numeric progression.
- Resolve the Quest for Meaning in original dialogue and mechanics. These scientific sources supply constraints, not a philosophical verdict or borrowed fictional setting.
